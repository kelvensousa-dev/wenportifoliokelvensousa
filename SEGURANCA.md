# Segurança — Kelven Studio

## Verificação em duas etapas (2FA) do admin

- **Obrigatória** para contas administrativas. Sem ela, o admin só acessa
  `/admin/seguranca` (tela de ativação); o resto do painel e as APIs do admin
  ficam bloqueados.
- Funciona com Google Authenticator, Microsoft Authenticator, Authy e similares.
- Admins **não podem** entrar com Google/GitHub: só e-mail + senha + código.
- O segredo fica **criptografado** no banco (AES-256-GCM, chave derivada do
  `NEXTAUTH_SECRET`). Quem tiver uma cópia do banco ou de um backup não
  consegue gerar códigos.
- Um código só vale uma vez (reuso bloqueado). Os 8 códigos de recuperação
  também são de uso único e ficam salvos apenas como hash.

⚠️ **Trocar o `NEXTAUTH_SECRET` invalida o 2FA** de todos os admins. Nesse
caso, use o procedimento abaixo e ative de novo.

### Perdi o celular / troquei de aparelho

1. Se ainda tiver códigos de recuperação: entre com um deles no lugar do
   código do app.
2. Sem códigos: redefina pelo servidor (exige acesso SSH, que só você tem).
   Na VPS:

   ```bash
   cd /var/www/kelven
   docker compose exec postgres psql -U platform -d platform -c \
     "UPDATE \"User\" SET \"totpSecret\"=NULL, \"totpPendingSecret\"=NULL, \"totpEnabledAt\"=NULL, \"totpLastStep\"=NULL, \"totpRecoveryHashes\"='{}' WHERE email='SEU_EMAIL_ADMIN';"
   ```

   No próximo acesso, o admin é levado à tela de ativação para cadastrar o
   novo celular.

## Servidor (VPS)

| Camada | Configuração |
| --- | --- |
| SSH | Porta 22022, somente chave (senha desativada), root só com chave |
| Firewall (ufw) | Entrada bloqueada, exceto 22022, 80 e 443 |
| fail2ban | Jail `sshd` nas portas 22 e 22022, bloqueio em todas as portas |
| Atualizações | `unattended-upgrades` ativo |
| Banco / Redis | Sem porta publicada (só rede interna do Docker) |
| `.env` | Permissão 600 (só root) |
| HTTPS | Let's Encrypt, renovação automática às segundas 03:00 |

## Backup

- Script: `/usr/local/bin/backup-kelven.sh` (cron diário às 02:30).
- Local: `/var/backups/kelven`, 14 dias, arquivo validado com `pg_restore --list`.
- Nuvem: Google Drive, pasta `backups-kelven`, **criptografado** pelo rclone
  (remote `gdrive-cripto`), 60 dias. Credenciais OAuth próprias (projeto
  `kelven-backup` no Google Cloud, escopo `drive.file`).
- Log: `tail -5 /var/log/backup-kelven.log` (esperado: `OK local` e `OK nuvem`).
- As duas senhas da criptografia ficam **fora do servidor**. Sem elas os
  backups da nuvem não podem ser abertos.

### Restaurar um backup

```bash
cd /var/www/kelven
rclone copy gdrive-cripto:kelven-AAAA-MM-DD_HHMM.dump /tmp/   # se vier da nuvem
docker compose exec -T postgres pg_restore -U platform -d platform --clean --if-exists < /tmp/kelven-AAAA-MM-DD_HHMM.dump
```

⚠️ `--clean` substitui os dados atuais. Em caso de dúvida, restaure primeiro
em um banco de teste.
