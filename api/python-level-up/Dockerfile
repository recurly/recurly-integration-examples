FROM python:3

WORKDIR /usr/src/app

COPY ./api/python-level-up ./python-level-up

RUN cd python-level-up && pip install -r requirements.txt

COPY ./public ./public

EXPOSE 9001

CMD FLASK_APP=python-level-up/app.py flask run -p 9001 --host 0.0.0.0
