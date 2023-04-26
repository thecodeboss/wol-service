import readline from 'readline';
import fs from 'fs';
import bcrypt from 'bcrypt';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptInput = (prompt: string): Promise<string> =>
  new Promise((resolve) => {
    rl.question(prompt, (input) => {
      resolve(input);
    });
  });

(async () => {
  console.log('🌱 Bud is here to help you generate your .env file.');

  const password = await promptInput('Please enter your password: ');
  const jwtSecret = await promptInput('Please enter your JWT secret: ');
  const baseIP = await promptInput(
    'Please enter the BASE_IP value (consult the project README for instructions on retrieving its value): '
  );

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, passwordHash) => {
    if (err) {
      console.error('Error hashing password:', err);
      rl.close();
      return;
    }

    const envFileContent = `PASSWORD_HASH=${passwordHash}\nJWT_SECRET=${jwtSecret}\nBASE_IP=${baseIP}\n`;

    fs.writeFile('.env', envFileContent, (err) => {
      rl.close();
      if (err) {
        console.error('Error writing .env file:', err);
        return;
      }
      console.log('🌿 Bud generated a .env file with your PASSWORD_HASH, JWT_SECRET, and BASE_IP values.');
    });
  });
})();
