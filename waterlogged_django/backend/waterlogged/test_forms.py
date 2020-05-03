#https://micropyramid.com/blog/django-unit-test-cases-with-forms-and-views/

#COMMAND TO RUN SPECIFIC TEST FILE
# python manage.py test waterlogged.test_forms from first backend folder to run

#COMMAND TO RUN ALL TEST FILES AT ONCE
# python manage.py test 

from django.test import TestCase
from django.test import Client
from  .forms import *

class ImageFormTest(TestCase):
    @classmethod
    #DUMMY DATA TO TEST AGAINST
    def setUpTestData(cls):
        Image.objects.create(
            filepath = '/localdir/xyz', 
            flood_date = 2020-03-27T16:49:05.123456Z,
            pre_post = True, 
            longitude = 20.1234, 
            latitude = 21.1234, 
            address = '400 Bizzell St.', 
            user_uploaded = 5, 
            pair_index = 12, 
            approved_by_admin = False, 
            pair_approved_by_admin = True, 
            flood_height = 123.321, 
            source = 'Google Images', 
            pair_attempted = True
        )

    #TO ASSERT THAT THE FORMS ARE TAKING IN VALID VALUES
    def test_image_form_valid(self):
        img = ImageForm(
            data={
                'filepath': '/localdir/xyz', 
                #'flood_date': '2020-03-27 16:49:05.123456',
                'pre_post': 'True', 
                'longitude': '20.1234', 
                'latitude': '21.1234', 
                'address': '400 Bizzell St.', 
                'user_uploaded': '5', 
                'pair_index': '12', 
                'approved_by_admin': 'False', 
                'pair_approved_by_admin': 'True', 
                'flood_height': '123.321', 
                'source': 'Google Images', 
                'pair_attempted': 'True'
            }
        )
        self.assertTrue(img.is_valid())

     #TO ASSERT THAT THE FORMS ARE NOT TAKING IN INVALID VALUES
    def test_image_form_invalid(self):
        img = ImageForm(
            data={
                'filepath': 'xyz', 
                #'flood_date': '2020-03-27 16:49:05.123456',
                'pre_post': '123', 
                'longitude': '20', 
                'latitude': '21', 
                'address': '400', 
                'user_uploaded': 'abc', 
                'pair_index': '12.12', 
                'approved_by_admin': '123', 
                'pair_approved_by_admin': 'True', 
                'flood_height': '123', 
                'source': '', 
                'pair_attempted': ''
            }
        )
        self.assertFalse(img.is_valid())
