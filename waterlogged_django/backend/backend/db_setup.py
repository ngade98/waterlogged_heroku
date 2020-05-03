#https://towardsdatascience.com/how-to-set-up-a-postgresql-database-on-amazon-rds-64e8d144179e
#https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html
#import psycopg2 as ps

#DEFINE CREDENTIALS
#ADDRESS: waterlogged.c7k2ehixxy4g.us-east-2.rds.amazonaws.com
#PORT: 5432
#USERNAME: postgres
#PASSWORD: waterlogged

#credentials = {'POSTGRES_ADDRESS' : 'waterlogged.c7k2ehixxy4g.us-east-2.rds.amazonaws.com', # change to your endpoint
#               'POSTGRES_PORT' : '5432', # change to your port
#               'POSTGRES_USERNAME' : 'postgres', # change to your username
#               'POSTGRES_PASSWORD' : 'waterlogged', # change to your password
#               'POSTGRES_DBNAME' : 'postgres'} # change to your db name

#CREATE CONNECTION CONNECTION AND CURSOR 
#conn = ps.connect(host=credentials['POSTGRES_ADDRESS'],
#                  database=credentials['POSTGRES_DBNAME'],
#                  user=credentials['POSTGRES_USERNAME'],
#                  password=credentials['POSTGRES_PASSWORD'],
#                  port=credentials['POSTGRES_PORT'])
#cur = conn.cursor()

#COLUMN NAMES: index, pre_post, filepath, longitude, latitude, user_uploaded, pair_index, approved_by_admin 
#CREATE TABLE COMMAND
#cur.execute("""CREATE TABLE images
#                (index integer, 
#                pre_post bool,
#                filepath varchar(75),
#                longitude float, 
#                latitude float,
#                user_uploaded integer, 
#                pair_index integer, 
#                approved_by_admin bool);""")

#COMMIT TABLE CREATION TO psql
#conn.commit()

#DATA TO BE INSERTED
#data = [1, True, 'newfilepath/itisnothere', 12.918273, 764.0002, 0, 2, False]

#INSERT INTO TABLE COMMAND
#insert_query = """INSERT INTO images
#                    (index, pre_post, filepath, longitude, latitude, user_uploaded, pair_index, approved_by_admin)
#                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"""
#cur.execute(insert_query, data)
    
#COMMIT INSERTION
#conn.commit()


#cur.execute("""SELECT * FROM images;""")
#cur.fetchall()

#query = """select relname from pg_class
#            where relname = 'images';"""
#cur.execute(query)
#cur.fetchall()

#RUN THIS COMMAND TO ACCESS PSQL QUERY EDITOR
#password = waterlogged
#\q to quit
#psql --host=waterlogged.c7k2ehixxy4g.us-east-2.rds.amazonaws.com --port=5432 --username=postgres --password --dbname=postgres