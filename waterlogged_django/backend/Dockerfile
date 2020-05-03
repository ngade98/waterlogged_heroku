#docker build -t ciberblupix/waterlogged_backend .
#docker run -p 8888:8000 ciberblupix/waterlogged_backend
#docker run ciberblupix/waterlogged_backend

FROM python:3.7

# set a directory for the app
WORKDIR /waterlogged_django/backend

# copy all the files to the container
COPY . . 

# install dependencies
RUN pip install -r requirements.txt

# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh 

# define the port number for postgres
EXPOSE 5432

# define the port number the container should expose
EXPOSE 8000

# run the command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]