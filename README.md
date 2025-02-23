# Carrinho

Ferramentas usadas:

- Nodejs
- Express
- MongoDB e Mongoose

## Iniciar o serviço localmente (BD no Atlas):
- Criar arquivo `.env` para conexão com bd mongo no Atlas, de acordo com o arquivo `.env.example`;

- Criar arquivo rabbitmq-container.env para conexão com container do RabbitMQ, de acordo com o arquivo `rabbitmq-container.env.example`

- Executar `npm run dev`

## Iniciar todos os serviços localmente usando containers (BD em container local):
- Criar arquivo `.env.local`, de acordo com o arquivo `.env.local.example`; **E**

- Criar arquivo `mongo-container.env` para conexão com bd mongo em container, de acordo com o arquivo `mongo-container.env.example`

- Executar `docker-compose up -d`

#### Executar a formatação de código na pasta src do projeto:

> npx prettier ./src --write