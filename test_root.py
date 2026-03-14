import requests
import json

try:
    # Test project root
    r = requests.get('http://localhost:8001/api/files/browse/tree?path=.')
    print(f'Project Root: {r.status_code}')
    if r.status_code == 200:
        data = r.json()
        print(f"  Name: {data.get('name')}, Children: {len(data.get('children', []))}")
        
    # Test C:\
    r = requests.get('http://localhost:8001/api/files/browse/tree?path=C:\\')
    print(f'C-Drive: {r.status_code}')
    if r.status_code == 200:
        data = r.json()
        print(f"  Name: {data.get('name')}, Children: {len(data.get('children', []))}")
        if data.get('children'):
            for child in data['children'][:5]:
                print(f"    - {child['name']}")
    else:
        print(f"  Error: {r.text}")
except Exception as e:
    print(f'Error: {e}')
