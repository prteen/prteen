from requests import get, post, delete, put, session

BASE_URL = "http://127.0.0.1:8080/api/v1"

# register
print("Register")
print(post(f"{BASE_URL}/auth/register", json={"username": "test", "password": "test", "email": "test@gmail.com"}).json())

# login
print("Login")
data = post(f"{BASE_URL}/auth/login", json={"username": "test", "password": "test"}).json()
print(data)

# get token
token = data["access_token"]

ses = session()
ses.headers.update({"Authorization": f"Bearer {token}"})

# get user id 
print("Get user id")
res = ses.get(f"{BASE_URL}/auth/me")
assert res.status_code == 200
user_id = res.json()["id"]

# get all parties
print("Get all parties")
res = ses.get(f"{BASE_URL}/parties")
assert res.status_code == 200
print(res.json())

# create party
print("Create party")
res = ses.post(f"{BASE_URL}/parties/organizers", json={
  "title": "string",
  "description": "string",
  "tags": [
    "string"
  ],
  "images": [],
  "date": "2023-05-31T14:58:40.716Z",
  "location": "string",
  "max_participants": 0,
  "private": False,
  "participants": [
    user_id
  ]
})
print(res.text)
assert res.status_code == 201
party_id = res.json()["id"]

# list organizers parties
print("List organizers parties")
res = ses.get(f"{BASE_URL}/parties/organizers/")
print(res.json())
assert res.status_code == 200
for party in res.json():
    if party["_id"] == party_id:
        break
assert party["_id"] == party_id

# update party
print("Update party")
res = ses.put(f"{BASE_URL}/parties/organizers/{party_id}", json={
    "title": "new_string",
    "description": "new_new_string"
})
print(res.json())
assert res.status_code == 200

# check if party was updated
print("Check if party was updated")
res = ses.get(f"{BASE_URL}/parties/id/{party_id}")
print(res.json())
assert res.status_code == 200
assert res.json()["title"] == "new_string"
assert res.json()["description"] == "new_new_string"

# get party by id
print("Get party by id")
res = ses.get(f"{BASE_URL}/parties/id/{party_id}")
print(res.text)
assert res.status_code == 200

# join party
print("Join party")
res = ses.put(f"{BASE_URL}/parties/join/{party_id}", data={"action": "join"})
print(res.json())
assert res.status_code == 200
assert res.json()["id"] == party_id

# list users parties
print("List users parties")
res = ses.get(f"{BASE_URL}/parties/users/")
print(res.json())
assert res.status_code == 200
for party in res.json():
    if party["_id"] == party_id:
        break
assert party["_id"] == party_id

# leave party
print("Leave party")
res = ses.put(f"{BASE_URL}/parties/join/{party_id}", json={"action": "leave"})
print(res.json())
assert res.status_code == 200
assert res.json()["id"] == party_id

