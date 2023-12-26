# Solução Delliv Fullstack Pleno Challenge

Minha solução para o [desafio delliv fullstack pleno](https://github.com/delliv-tech/delliv-coding-challenge-fullstack-pleno)

## Como executar

No diretório raiz do repositório execute `docker-compose up --detach` para executar todos os serviços do projeto

Para visualizar os logs de cada container, execute `docker container logs <container_name>` ou use `logs --follow <container>` para pendurar na stream de logs.

Os serviços devem estar disponíveis em:

- challenge_app `http://localhost:3000`
- challenge_server `http://localhost:3333`
- postgres_db `localhost:5432`

## Licença

[MIT License](./LICENSE)
