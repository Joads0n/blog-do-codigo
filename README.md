# Blog do código - Auth with tokens

Implementation of a API in [NodeJs](https://nodejs.org/en/), using authentication system and tokens, during the course of [Alura](https://cursos.alura.com.br), aim at the learning.

Aiming for a more scalable token validation system than session authentication.

Concepts seen and practiced:

* Used Lib bcrypt for generate passwords hash with salt.
* Used Lib passport, passport-local and passport-http-bearer to middlawares of the authentication. 
* Used Lib jsonwebtoken for generate access tokens with time expiration and returns to user.
* Custom authentication errors.
* Logout using tokens with blocklist and redis.
* Routes protected by authentication middleware.
* Authentication with acess tokens and refresh tokens.
* Allow List to refresh tokens.
* Used lib nodemailer to send verification email with token id to user.
* Control Access and Permissions (PABC & RBAC)

## Blog Documentation:

# Política de Acesso ao conteúdo

## Propósito

Esse documento contém todas as informações necessárias sobre o controle e acesso ao conteúdo no Blog do código.

Esse documento deve ser lido por todas as pessoas que trabalham no Blog do Código.



## Autenticação

Antes de prosseguir com o uso da API, é necessário que crie uma nova conta através da rota POST /usuario, e em seguida, verificar o e-mail da nova conta através da rota GET usuario/verifica_email/:token .

Com a conta criada e verificada, use a rota de login POST /usuario/login para obter um token de acesso através do cabeçalho Authorization na resposta. Use esse cabeçalho nas demais requisições para se autenticar com a API e prosseguir ao controle de acesso ao conteúdo.



## Controle de conteúdo do Blog

No nosso blog, temos o cargo de assinante. A pessoa com cargo de assinante apenas pode ler os posts do blog, os posts de qualquer pessoa.

Além do cargo de assinante, também temos o cargo editor. A pessoa com cargo de editor, ela pode e deve cadastrar novos posts no blog e gerenciá-los.

Por último, o blog possui o cargo de admin. O cargo de administrador é o cargo para as pessoas que vão gerenciar os usuários e posts do nosso blog.


