import traceback
from datetime import datetime
from collections import defaultdict
import re
from MyMcdAPI import MyMcdAPI, PermissionDeniedError, Role

def analyze_career(email, password):
    try:
        api = MyMcdAPI(email, password)
        api.login()
        
        me = api.get_me()
        
        # Attempt to get entryDate or hireDate, fallback to 2012 (MyMcd wasn't earlier)
        entry_date_str = me.get("entryDate") or me.get("hireDate") or "2012-01-01T00:00:00"
        try:
            start_year = int(entry_date_str[:4])
        except:
            start_year = 2012
            
        current_year = datetime.now().year
        
        all_shifts = []
        for year in range(start_year, current_year + 1):
            from_d = f"{year}-01-01"
            to_d = f"{year}-12-31"
            print(f"Fetching shifts for {year}...")
            # Use employee_id = None to default to self
            res = api.get_employee_shifts(from_date=from_d, to_date=to_d)
            if res and isinstance(res, list):
                all_shifts.extend(res)
            elif res and isinstance(res, dict) and "shiftPlans" in res:
                all_shifts.extend(res.get("shiftPlans", []))
            elif res and isinstance(res, dict) and "shifts" in res:
                all_shifts.extend(res.get("shifts", []))
            elif res and isinstance(res, dict) and "data" in res:
                all_shifts.extend(res.get("data", []))
                
        total_shifts = 0
        total_worked_mins = 0
        total_pause_mins = 0
        tr_count = 0
        manager_notes_count = 0
        first_shift_date = None
        
        month_hours = defaultdict(float)
        shift_lengths_histogram = defaultdict(int)
        days_worked_histogram = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
        
        # regex for TR and a number (e.g. tr318, tr 19)
        tr_regex = re.compile(r'\btr\s*\d+\b', re.IGNORECASE)
        # regex for OS, RS, NS (must start at the beginning of the note, followed by space or end)
        manager_regex = re.compile(r'^(os|rs|ns)(?:\s+|$)', re.IGNORECASE)

        for s in all_shifts:
            date_str = s.get("date")
            if not date_str:
                continue
                
            try:
                st = datetime.fromisoformat(date_str)
            except ValueError:
                continue 
                
            total_shifts += 1
            
            if not first_shift_date or st < first_shift_date:
                first_shift_date = st
            
            worked_mins = 0
            
            # Combine intervals and fixedIntervals just in case
            all_intervals = s.get("intervals", []) + s.get("fixedIntervals", [])
            if not all_intervals:
                total_shifts -= 1 # Rollback, invalid shift
                continue

            for inter in all_intervals:
                # 'length' contains worked hours already deducting breaks
                length_hours = float(inter.get("length") or 0)
                worked_mins += length_hours * 60.0
            
            # Use hasBreak directly as requested
            pause_mins = 30 if s.get("hasBreak") else 0
                
            total_worked_mins += worked_mins
            total_pause_mins += pause_mins
            
            bucket_hours = round((worked_mins / 60.0) * 2) / 2.0
            shift_lengths_histogram[bucket_hours] += 1
            
            day_of_week = st.weekday()
            days_worked_histogram[day_of_week] += 1
            
            month_key = st.strftime("%Y-%m")
            month_hours[month_key] += worked_mins / 60.0
            
            note = str(s.get("note", "") or s.get("description", "") or "").strip()
            if tr_regex.search(note):
                tr_count += 1
                
            if manager_regex.search(note):
                manager_notes_count += 1

        busiest_month = max(month_hours, key=month_hours.get) if month_hours else "-"
        busiest_month_hours = round(month_hours[busiest_month], 1) if busiest_month != "-" else 0
        
        # ensure keys are nicely sorted by numeric value
        hist_formatted = [{"length": str(k), "count": v} for k, v in sorted(shift_lengths_histogram.items()) if v > 0]
        
        day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        days_formatted = [{"day": day_names[k], "count": v} for k, v in days_worked_histogram.items()]

        # Collect first and last names if possible
        first_name = me.get("firstName") or me.get("employee", {}).get("firstName")
        last_name = me.get("lastName") or me.get("surname") or me.get("employee", {}).get("lastName") or me.get("employee", {}).get("surname")
        
        if not first_name:
            try:
                emp_info = api.get_employee_details(api.user_id)
                emp_data = emp_info.get("data", emp_info)
                first_name = emp_data.get("firstName")
                last_name = emp_data.get("lastName") or emp_data.get("surname")
            except Exception:
                pass
                
        if first_name and last_name:
            emp_name = f"{first_name} {last_name}"
        elif first_name:
            emp_name = first_name
        elif me.get("name"):
            emp_name = me.get("name")
        else:
            emp_name = "McDonald's Star"

        return {
            "success": True,
            "data": {
                "name": emp_name,
                "total_shifts": total_shifts,
                "hours_worked": round(total_worked_mins / 60.0, 1),
                "hours_pause": round(total_pause_mins / 60.0, 1),
                "tr_count": tr_count,
                "first_shift_date": first_shift_date.strftime("%d. %m. %Y") if first_shift_date else "N/A",
                "is_manager": api.role == Role.MANAGER,
                "manager_notes_count": manager_notes_count,
                "busiest_month": busiest_month,
                "busiest_month_hours": busiest_month_hours,
                "shift_histogram": hist_formatted,
                "days_histogram": days_formatted
            }
        }
        
    except PermissionDeniedError as e:
        return {"success": False, "error": f"Permission denied: {str(e)}"}
    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": str(e)}
