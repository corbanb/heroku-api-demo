# Heroku API Demo

## Routes
See how many deploys you have made.

*Base URL:* https://heroku-api-barbershopio.herokuapp.com/

### GET - /heroku/deploys
**params:** api
**value:** HEROKU_API_KEY  
DOCS: https://devcenter.heroku.com/articles/authentication  

**Example:** https://heroku-api-barbershopio.herokuapp.com?api=HEROKU_API_KEY  

```javascript
# response

{
total: 100,
successful: 100,
failed: 0,
apps: [
{
app: "my-app",
total: 100,
successful: 100,
failed: 0
}
]
}
```
