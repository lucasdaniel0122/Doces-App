# Documentação SQL - Banco de Dados do Sistema

Este diretório reúne toda a estrutura do banco de dados utilizada pelo sistema de gestão de doces. Aqui ficam os scripts SQL, diagramas, informações sobre tabelas e instruções para importação.

## 🗄️ Objetivo desta pasta
- Documentar o banco de dados de maneira clara;
- Organizar scripts SQL por etapa ou funcionalidade;
- Manter histórico das alterações na estrutura do banco;
- Facilitar a instalação do banco para qualquer desenvolvedor;
- Servir de apoio para consultas, manutenção e futuras integrações;

## O que será armazenado aqui

- Scripts de criação de tabelas;
- Inserts básicos (produtos iniciais, usuários, etc.);
- Queries importantes;
- Dump completo do banco;
- Diagramas de modelagem;

## 🔧 Como instalar o Banco de Dados
1. Instale o MySQL Server;
2. Crie um banco de dados inical:
´´´
CREATE DATABASE sistema_doces;

´´´
3. Importe os scripts desta pasta
- No MySQL Workbench, use:
´´´
Server -> Data Import -> Import from Self-Contained File

´´´
- Ou pelo terminal:
´´´
mysql -u root -p sistema_doces < script_inicial.sql

´´´
4. Verifique se as tabelas foram criadas corretamente;

## 📁 Estrutura da pasta
´´´
sql/
 └── docs/
       ├── README.md        # Este arquivo
       ├── modelo.png       # Futuro diagrama do banco (opcional)
       ├── tabela_produtos.sql
       ├── tabela_usuarios.sql
       ├── tabela_vendas.sql
       └── scripts_adicionais/

´´´
## 📘 Padrões de Modelagem
Para manter tudo organizado, seguiremos alguns padrões:
- Nome das tabelas no singular: produto, usuario, venda;
- Chave primária sempre id;
- Chaves estranegiras com nomes claros (id_produto, id_usuario);
- Datas no formato DATETIME;

## 📝 Guia de Desenvolviemnnnto SQL
- Começar criando as tabelas principais (produtos, vendas, usuários);
- Adicionar tabelas auxiliares conforme evoluírem as funcionalidades;
- Criar provedures e views apenas quando necessário;
- Documentar qualquer alteração importante nesta pasta;