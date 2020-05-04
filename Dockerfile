#docker build -t ciberblupix/waterlogged_frontend .
#docker run -p 3333:3000 ciberblupix/waterlogged_frontend
#docker run ciberblupix/waterlogged_frontend

FROM node:13

# set a directory for the app
WORKDIR /waterlogged_django/waterlogged-react

# copy all the files to the container
COPY . . 

# install dependencies
#RUN npm cache clean --force
RUN npm install
RUN npm install @material-ui/core

# define the port number the container should expose
EXPOSE 3000

# run the command
CMD ["npm", "start"]