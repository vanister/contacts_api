# use this dockerfile to build an image for this api

FROM node:12.18.0

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# ENV AWS_ENDPOINT='http://localhost:8000'
# ENV AWS_REGION='us-west-1'
# ENV AWS_ACCESS_KEY_ID='from-dockerfile-fake-access-key'
# ENV AWS_SECRET_ACCESS_KEY='from-dockerfile-fake-secret-key'

CMD [ "npm", "start" ]
