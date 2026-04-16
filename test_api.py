import json
import traceback
from datetime import datetime
from MyMcdAPI import MyMcdAPI

def run_tests():
    print("=== McdWrapped API Debugger ===")
    email = input("Enter your MyMcd Email: ")
    import getpass
    password = getpass.getpass("Enter your password: ")

    try:
        api = MyMcdAPI(email, password)
        print("\nLogging in...")
        api.login()
        print("Login successful!\n")

        print("--- Testing get_me() ---")
        me = api.get_me()
        print("Resolved Context variables in class:")
        print(f"user_id: {api.user_id}")
        print(f"restaurant_id: {api.restaurant_id}")
        print(f"role: {api.role.name}")
        
        print("\nChecking dates in get_me():")
        for key in ["hireDate", "entryDate", "dateOfEntry"]:
            if key in me:
                print(f"Found {key}: {me[key]}")
                
        # Test 1 month query to see structure
        now = datetime.now()
        first_day = now.replace(day=1).strftime("%Y-%m-%d")
        last_day = now.strftime("%Y-%m-%d") # Up to today
        
        print(f"\n--- Testing get_employee_shifts ({first_day} to {last_day}) ---")
        try:
            shifts = api.get_employee_shifts(from_date=first_day, to_date=last_day)
            print("Successfully fetched short duration shifts. Raw response type:", type(shifts))
            print("Preview of payload:")
            # Only print first 500 chars to avoid spilling
            print(json.dumps(shifts, indent=2, ensure_ascii=False)[:1000] + "\n...[truncated]")
        except Exception as e:
            print(f"Error fetching short duration shifts: {e}")

        # Test 1 year query to see if it causes a 400 error
        year_start = f"{now.year}-01-01"
        year_end = f"{now.year}-12-31"
        print(f"\n--- Testing get_employee_shifts 1 FULL YEAR ({year_start} to {year_end}) ---")
        try:
            shifts_year = api.get_employee_shifts(from_date=year_start, to_date=year_end)
            print("Successfully fetched full year shifts.")
        except Exception as e:
            print(f"Error fetching full year shifts: {e}")

    except Exception as e:
        print("\nCritical Error occurred:")
        traceback.print_exc()

if __name__ == "__main__":
    run_tests()
