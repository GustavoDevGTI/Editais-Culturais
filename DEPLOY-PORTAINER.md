# Deploy no Portainer

Esta stack compila a aplicação React/Vite e a publica com Nginx na porta `13015` do servidor.

## Criar a stack pelo repositório Git

No Portainer, acesse **Stacks > Add stack** e selecione **Git repository**.

- **Repository URL:** `https://github.com/GustavoDevGTI/Editais-Culturais.git`
- **Repository reference:** `refs/heads/main`
- **Compose path:** `docker-compose.yml`

Nenhuma variável de ambiente é obrigatória. A stack usa a porta `13015` por padrão. Se for necessário alterar o bind ou a porta, defina na stack:

```env
WEB_BIND=0.0.0.0
WEB_PORT=13015
```

Depois, clique em **Deploy the stack**. O container deve aparecer como `healthy` e o teste direto deve responder em:

```text
http://IP_DO_SERVIDOR:13015/
```

## Domínio e proxy reverso

Crie ou confirme o registro DNS de `cultura.amargosa.ba.gov.br` apontando para o IP público do proxy/servidor. No proxy reverso, encaminhe:

```text
cultura.amargosa.ba.gov.br -> http://IP_DO_SERVIDOR_PORTAINER:13015
```

O certificado HTTPS deve ser terminado no proxy reverso (por exemplo, Nginx Proxy Manager, Traefik ou Cloudflare). Ative o encaminhamento dos cabeçalhos `Host`, `X-Forwarded-For` e `X-Forwarded-Proto`.

## Atualização

Após novos commits na branch `main`, use **Pull and redeploy** na stack. Se o webhook do Portainer estiver habilitado, ele também pode ser usado para automatizar o redeploy.
