API ENDPOINTS:

GET **/events** - returns all events

Parameters:
location: String, not required, _LIKE_ search, case-insensitive
date: String, not required, format yyyy-MM-dd, case-insensitive
max: Int, not required,
orderBy: Enum, date or location, non required

POST **/events** - create single event

GET **/events/:id** - returns single event

PATCH **/events/:id** - update single event

DELETE **/events/:id** - delete single event
