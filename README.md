# APItextJustify
Simply an API that takes a text as parameter and return it justified.

## How it works ?
There's is three route /api/justify, /api/token, /api/users. To be able to use the /justify route you need to have a token, so first step is to run the route /api/token with a body key email. It will create a user with this email and return the token of this user. 
For the /justify route to work you need to pass the token in the headers as -> token: "eduiefhiurvr". After that if you have enterred a text in the body, you can run the route /justify and it will return that text justified.

## How to install ?
Clone the project in your folder.
1. git clone https://github.com/MatetlotDev/APItextJustify.git
2. cd APItextJustify
3. npm i 

And you are good to go !

I suggest you test it with postman or thunder Client (vsCode extension).

## Technologies used :
quick.db : I preferred to use quick.db for this project, than MongoDB that I usually use. Because quick.db, as it is called, is quick to use, no need to create a new database. It didn't seem  important to me.

jsonwebtoken : The dependency to create token 

express : I have used express for the server, which is easy to use and also the one I'm more familiar with.

## Inspiration :
Thanks to Michael Muinos on youtube (https://www.youtube.com/watch?v=GqXlEbFVTXY&t=538s&ab_channel=MichaelMuinos) for his video. The algorithm comes from it.
Thanks to https://github.com/Alexmdz77/API-REST-justify for his work, a very nice job by him.

## Contraints : 
- The length of each line must be 80 char max.
- The endpoint must be of the form /api/justify and must return a justified text following a POST request with a body of ContentType text/plain
- The API must use a unique token authentication mechanism. By using for example an api/token endpoint that returns a token from a POST request with a json body {"email": "foo@bar.com"}.
- There must be a rate limit per token for the /api/justify endpoint, set at 80,000 words per day, if there are more during the day then a 402 Payment Required error must be returned.

## Tests :
How to test the API ? Very simple. You can either install the project by following the above installation. Or simply use this url https://sheltered-plains-36658.herokuapp.com/.

First : run the API on the route /api/token, with a POST request and a body like so: {email: foo.bar@mail.com}

It will response a user with a newly created token. Copy the token and paste it in the headers like so -> headers: key: token, value: 'your token'

Secondly : you can put your text in the body and run the route /api/justify

It will respond your text but justified.

And finally : You can try the route /api/users with a GET request and it will respond with the users already  logged in.

Note: If you exceed 80000 words in a day, a 402 error will occur and you'll have to make a new token.


