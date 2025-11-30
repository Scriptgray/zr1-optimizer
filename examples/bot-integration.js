import { zr1, speedBooster, responseTurbo } from 'zr1-optimizer';

console.log('🤖 Bot con ZR1 Optimizer Profesional');

const bot = {
  async sendMessage(chatId, message) {
    return responseTurbo.instantResponse(
      `msg:${chatId}:${message}`,
      async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return { success: true, timestamp: Date.now() };
      }
    );
  },

  async getUserData(userId) {
    return speedBooster.turboOperation(
      `user:${userId}`,
      async () => {
        const userData = { id: userId, name: `User${userId}`, premium: true };
        await new Promise(resolve => setTimeout(resolve, 50));
        return userData;
      },
      60000
    );
  }
};

async function demo() {
  const stats = zr1.getAllStats();
  console.log('📊 Estadísticas iniciales:', stats);
  
  for (let i = 0; i < 5; i++) {
    const message = await bot.sendMessage('chat123', `Hello ${i}`);
    const user = await bot.getUserData(i);
    console.log(`✅ Mensaje ${i}:`, message);
  }
  
  const finalStats = zr1.getAllStats();
  console.log('📈 Estadísticas finales:', finalStats);
}

demo();