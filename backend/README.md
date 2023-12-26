# Solução backend

## Como executar

Utilizado o docker com o docker-compose é possível executar todos os serviços do backend com `docker-compose up`.

Os serviços devem estar disponíveis em:

- challenge_server `http://localhost:3333`
- postgres_db `localhost:5432`

### Sem docker

Para executar a API sem o docker, certifique de estar executando uma instância do postgres em `DATABASE_URL` com todas as migrações mais recentes aplicadas, executando `npm run db:migrate`.

O arquivo de `.env` deve garantir que todas as variáveis de ambiente sejam providas, sem a necessidade de passar manualmente.

## Como usar

A API pode ser consumida pelo frontend or por seu cliente HTTP favorito (Postman, Insomnia, curl) seguindo a documentação dos [metodos da API](#http-api).

## HTTP API

A API expõe os seguintes métodos

**Usuário**

- `POST /iam/auth` Autenticar usuário | body [UserCredentialSchema](/backend/src/module/iam/validation/Schema.ts)
- `POST /iam/user` Criar usuário | body [CreateUserSchema](/backend/src/module/iam/validation/Schema.ts)
- `GET  /iam/user/me` Ler usuário autenticado

**Pedido**

- `POST /delivery/order` Cria pedido | body [CreateOrderSchema](/backend/src/module/delivery/validation/Schema.ts)
- `GET  /delivery/order` Lista pedidos criados pelo usuário
- `GET  /delivery/order/:id` Ler pedido por ID

**Evento de entrega** (_extra_)

- `POST /delivery/event` Cria evento de entrega | body [CreateDeliveryEventSchema](/backend/src/module/delivery/validation/Schema.ts)
- `GET  /delivery/event` Lista eventos de entrega
- `GET  /delivery/event/:id` Ler evento de entrega por ID

> Verifique as schemas de validação para saber quais dados são enviados no body das requisições `POST`.

## Build

Para fazer a build da API, execute `npm run build` para gerar os arquivos no diretório [build](./build/).

## Testes

A suite de testes do backend incluem testes dos casos de uso principais e outros testes unitários.

Antes de executar os testes, garanta que todos os pacotes estejam instalados com executando `npm install`.

Execute `npm run test` ou `npm run test:cov` para verificar a cobertura (_coverage_) dos testes.

## Desenvolvimento

A forma mais fácil executar o sistema em desenvolvimento e utilizando o `docker-compose up` para subir todas as instancias dos serviços necessários.

O [docker-compose.yaml](./docker-compose.yaml) está configurado por padrão para suportar **hot reload**, então, qualquer alteração nos arquivos do código irá executar o serviço com as alterações mais recentes.
