FROM python:3

WORKDIR /usr/src/app

COPY ./api/python .

RUN pip install -r requirements.txt

COPY ./public ./public

EXPOSE 9001

CMD FLASK_APP=app.py flask run -p 9001 --host 0.0.0.0
