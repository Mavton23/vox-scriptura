// prisma/seed-autores-e-frases.ts
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter: adapter
})

async function main() {
  console.log('🌱 Iniciando seed de novos autores e frases diárias...')

  // NOTA: Não estamos limpando os dados existentes para preservar o conteúdo já criado
  // Apenas adicionaremos novos autores e frases

  console.log('📝 Criando novos autores...')

  // Verificar se os autores já existem antes de criar
  const autoresExistentes = await prisma.author.findMany({
    where: {
      slug: {
        in: ['william-kelly', 'john-nelson-darby', 'bruce-anstey', 'norman-berry', 'andrew-miller', 'c-h-mackintosh']
      }
    }
  })

  const autoresExistentesMap = new Map(autoresExistentes.map(a => [a.slug, a]))

  // Autores a serem criados (apenas os que não existem)
  const autoresParaCriar = []

  // William Kelly (pode já existir do seed anterior)
  if (!autoresExistentesMap.has('william-kelly')) {
    autoresParaCriar.push({
      name: 'William Kelly',
      slug: 'william-kelly',
      description: 'Teólogo e escritor irlandês, discípulo de J.N. Darby. Escreveu extensivamente sobre a Bíblia e doutrina cristã, sendo um dos principais expositores dos ensinamentos dos Irmãos de Plymouth no século XIX.',
      bioUrl: 'https://en.wikipedia.org/wiki/William_Kelly_(Bible_scholar)'
    })
  }

  // John Nelson Darby (pode já existir do seed anterior)
  if (!autoresExistentesMap.has('john-nelson-darby')) {
    autoresParaCriar.push({
      name: 'John Nelson Darby',
      slug: 'john-nelson-darby',
      description: 'Teólogo anglo-irlandês, figura influente entre os Irmãos de Plymouth. Conhecido por seus escritos sobre profecia, eclesiologia e por sua tradução da Bíblia. Seu ensino sobre o arrebatamento pré-tribulacional e a distinção entre Israel e a Igreja marcou profundamente a teologia moderna.',
      bioUrl: 'https://en.wikipedia.org/wiki/John_Nelson_Darby'
    })
  }

  // Bruce Anstey
  if (!autoresExistentesMap.has('bruce-anstey')) {
    autoresParaCriar.push({
      name: 'Bruce Anstey',
      slug: 'bruce-anstey',
      description: 'Escritor e pregador cristão associado aos Irmãos de Plymouth. Autor de diversos livros sobre doutrina bíblica, profecia e a história da igreja. Suas obras são conhecidas por sua clareza expositiva e fidelidade às Escrituras.',
      bioUrl: 'https://www.bruceanstey.com'
    })
  }

  // Norman Berry
  if (!autoresExistentesMap.has('norman-berry')) {
    autoresParaCriar.push({
      name: 'Norman Berry',
      slug: 'norman-berry',
      description: 'Escritor e pregador cristão, conhecido por seus escritos sobre a sã doutrina e a importância da verdadeira adoração. Suas obras abordam temas como a igreja, a ceia do Senhor e a comunhão dos santos.',
      bioUrl: ''
    })
  }

  // Andrew Miller
  if (!autoresExistentesMap.has('andrew-miller')) {
    autoresParaCriar.push({
      name: 'Andrew Miller',
      slug: 'andrew-miller',
      description: 'Historiador e escritor cristão do século XIX, autor da clássica "História da Igreja" em vários volumes. Seus escritos fornecem uma visão detalhada do desenvolvimento do cristianismo desde os apóstolos até seus dias, com ênfase na fidelidade doutrinária.',
      bioUrl: 'https://en.wikipedia.org/wiki/Andrew_Miller_(writer)'
    })
  }

  // C. H. Mackintosh (C.H. Mackintosh)
  if (!autoresExistentesMap.has('c-h-mackintosh')) {
    autoresParaCriar.push({
      name: 'C. H. Mackintosh',
      slug: 'c-h-mackintosh',
      description: 'Pregador e escritor irlandês do século XIX, conhecido por seus "Estudos sobre o Pentateuco" e outros escritos devocionais. Suas obras são valorizadas por sua profundidade espiritual e capacidade de tornar verdades bíblicas acessíveis a todos os crentes.',
      bioUrl: 'https://en.wikipedia.org/wiki/C._H._Mackintosh'
    })
  }

  // Criar os autores que não existem
  const autoresCriados = []
  for (const autor of autoresParaCriar) {
    try {
      const novoAutor = await prisma.author.create({ data: autor })
      autoresCriados.push(novoAutor)
      console.log(`✅ Autor criado: ${autor.name}`)
    } catch (error) {
      console.error(`❌ Erro ao criar autor ${autor.name}:`, error)
    }
  }

  console.log(`📊 Autores criados: ${autoresCriados.length} (${autoresParaCriar.length - autoresCriados.length} falhas)`)

  // Buscar todos os autores atuais (incluindo os já existentes)
  const todosAutores = await prisma.author.findMany()
  const autoresMap = new Map(todosAutores.map(a => [a.slug, a]))

  console.log(`📚 Total de autores na plataforma: ${todosAutores.length}`)

  // Criar versículos diários para os novos autores
  console.log('📖 Criando versículos diários...')

  // Função para gerar datas sequenciais
  const getNextDate = (startDate: Date, daysToAdd: number): Date => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + daysToAdd)
    return date
  }

  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  const verses = [
    // Versículos de William Kelly
    {
      verse: '2 Timóteo 2:15',
      text: 'Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar, que maneja bem a palavra da verdade.',
      explanation: 'O estudo diligente das Escrituras não é apenas para conhecimento intelectual, mas para que possamos ser obreiros aprovados por Deus. Manejar bem a palavra da verdade significa interpretá-la corretamente, sem distorções, e aplicá-la fielmente à nossa vida e ensino.',
      authorId: autoresMap.get('william-kelly')!.id,
      tags: ['estudo bíblico', 'obreiros', 'verdade'],
      scheduledFor: getNextDate(startDate, 1)
    },
    {
      verse: 'Colossenses 1:18',
      text: 'Ele é a cabeça do corpo, da igreja; é o princípio e o primogênito dentre os mortos, para que em tudo tenha a preeminência.',
      explanation: 'Cristo deve ter o primeiro lugar em todas as coisas, especialmente na igreja. Não podemos permitir que líderes humanos, tradições ou programas ocupem o lugar que pertence somente a Ele. A igreja é Seu corpo, e Ele é a cabeça que dirige e governa.',
      authorId: autoresMap.get('william-kelly')!.id,
      tags: ['igreja', 'cabeça', 'preeminência de cristo'],
      scheduledFor: getNextDate(startDate, 2)
    },

    // Versículos de John Nelson Darby
    {
      verse: '1 Tessalonicenses 4:16-17',
      text: 'Porque o mesmo Senhor descerá do céu com alarido, e com voz de arcanjo, e com a trombeta de Deus; e os que morreram em Cristo ressuscitarão primeiro. Depois nós, os que ficarmos vivos, seremos arrebatados juntamente com eles nas nuvens, para encontrar o Senhor nos ares, e assim estaremos sempre com o Senhor.',
      explanation: 'Esta é a bendita esperança da igreja: o arrebatamento. Não estamos esperando por sinais ou tribulação, mas pelo próprio Senhor que virá nos buscar. A ordem é clara: os mortos em Cristo ressuscitam primeiro, depois os vivos são transformados, e todos encontramos o Senhor nos ares. Que esperança gloriosa!',
      authorId: autoresMap.get('john-nelson-darby')!.id,
      tags: ['arrebatamento', 'esperança', 'volta de cristo'],
      scheduledFor: getNextDate(startDate, 3)
    },
    {
      verse: 'Efésios 1:3',
      text: 'Bendito o Deus e Pai de nosso Senhor Jesus Cristo, o qual nos abençoou com todas as bênçãos espirituais nos lugares celestiais em Cristo.',
      explanation: 'Nossa porção como crentes não é terrena, mas celestial. Deus já nos abençoou com TODAS as bênçãos espirituais em Cristo. Não estamos esperando por bênçãos futuras - já as possuímos em Cristo. A questão é vivermos à altura dessa posição celestial.',
      authorId: autoresMap.get('john-nelson-darby')!.id,
      tags: ['bênçãos espirituais', 'lugares celestiais', 'posição em cristo'],
      scheduledFor: getNextDate(startDate, 4)
    },

    // Versículos de Bruce Anstey
    {
      verse: 'Atos 2:42',
      text: 'E perseveravam na doutrina dos apóstolos, e na comunhão, e no partir do pão, e nas orações.',
      explanation: 'Este versículo descreve a prática da igreja primitiva: doutrina dos apóstolos (a Palavra de Deus), comunhão (compartilhar a vida em Cristo), partir do pão (a ceia do Senhor) e orações. Este é o padrão bíblico para a reunião dos santos, sem adições humanas ou tradições inventadas.',
      authorId: autoresMap.get('bruce-anstey')!.id,
      tags: ['igreja primitiva', 'doutrina', 'comunhão', 'ceia'],
      scheduledFor: getNextDate(startDate, 5)
    },
    {
      verse: 'Mateus 18:20',
      text: 'Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.',
      explanation: 'A presença de Cristo no meio dos seus não depende de números, edifícios imponentes ou organizações humanas. Onde dois ou três estão simplesmente reunidos ao Seu nome, reconhecendo-O como centro e cabeça, Ele promete estar presente. Esta é a base da verdadeira assembleia local.',
      authorId: autoresMap.get('bruce-anstey')!.id,
      tags: ['reunião', 'nome de jesus', 'presença de cristo'],
      scheduledFor: getNextDate(startDate, 6)
    },

    // Versículos de Norman Berry
    {
      verse: 'João 4:23-24',
      text: 'Mas a hora vem, e agora é, em que os verdadeiros adoradores adorarão o Pai em espírito e em verdade; porque o Pai procura a tais que assim o adorem. Deus é Espírito, e importa que os que o adoram o adorem em espírito e em verdade.',
      explanation: 'A verdadeira adoração não é uma questão de lugar, ritual ou cerimônia. É uma questão do espírito (a parte mais profunda do nosso ser) se conectando com Deus, que é Espírito, e baseada na verdade revelada em Cristo e nas Escrituras. O Pai procura adoradores, não entretenimento religioso.',
      authorId: autoresMap.get('norman-berry')!.id,
      tags: ['adoração', 'espírito e verdade', 'verdadeiros adoradores'],
      scheduledFor: getNextDate(startDate, 7)
    },
    {
      verse: 'Hebreus 10:24-25',
      text: 'E consideremo-nos uns aos outros, para nos estimularmos ao amor e às boas obras, não deixando a nossa congregação, como é costume de alguns; antes admoestando-nos uns aos outros; e tanto mais quanto vedes que se vai aproximando aquele dia.',
      explanation: 'A exortação aqui não é para "ir à igreja", mas para não abandonar a nossa congregação - o ato de nos reunirmos como assembleia. O propósito é mútuo: estimular ao amor e boas obras, e admoestar uns aos outros. Precisamos uns dos outros para perseverar na fé.',
      authorId: autoresMap.get('norman-berry')!.id,
      tags: ['congregação', 'exortação', 'comunhão'],
      scheduledFor: getNextDate(startDate, 8)
    },

    // Versículos de Andrew Miller
    {
      verse: 'Apocalipse 2:4-5',
      text: 'Tenho, porém, contra ti que deixaste o teu primeiro amor. Lembra-te, pois, de onde caíste, e arrepende-te, e pratica as primeiras obras; porque se não, brevemente a ti virei, e tirarei do seu lugar o teu castiçal, se não te arrependeres.',
      explanation: 'A história da igreja mostra como, ao longo dos séculos, o primeiro amor tem sido abandonado. Esta mensagem à igreja em Éfeso é relevante para todos os tempos. Não basta ter doutrina correta, obras e perseverança - é essencial manter o amor por Cristo e pelos irmãos. O arrependimento é a única solução.',
      authorId: autoresMap.get('andrew-miller')!.id,
      tags: ['primeiro amor', 'história da igreja', 'arrependimento'],
      scheduledFor: getNextDate(startDate, 9)
    },
    {
      verse: 'Judas 3',
      text: 'Amados, procurando eu escrever-vos com toda a diligência acerca da salvação comum, tive por necessidade escrever-vos, e exortar-vos a batalhar pela fé que uma vez foi dada aos santos.',
      explanation: 'A fé cristã não é um conjunto de doutrinas em evolução, mas uma vez por todas entregue aos santos. Nossa responsabilidade é batalhar por ela, defendê-la contra ataques internos e externos, e transmiti-la fielmente às próximas gerações. A história mostra o preço pago por aqueles que assim fizeram.',
      authorId: autoresMap.get('andrew-miller')!.id,
      tags: ['fé', 'batalha espiritual', 'defesa da fé'],
      scheduledFor: getNextDate(startDate, 10)
    },

    // Versículos de C.H. Mackintosh
    {
      verse: 'Gálatas 2:20',
      text: 'Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim; e a vida que agora vivo na carne, vivo-a na fé do Filho de Deus, o qual me amou e se entregou a si mesmo por mim.',
      explanation: 'Este é o segredo da vida cristã: não é mais eu que vivo, mas Cristo vive em mim. A velha natureza foi crucificada com Cristo, e agora temos uma nova vida, a própria vida de Cristo em nós. Viver pela fé no Filho de Deus significa depender dEle a cada momento para viver essa vida.',
      authorId: autoresMap.get('c-h-mackintosh')!.id,
      tags: ['crucificado com cristo', 'nova vida', 'fé'],
      scheduledFor: getNextDate(startDate, 11)
    },
    {
      verse: 'Êxodo 25:8',
      text: 'E me farão um santuário, e habitarei no meio deles.',
      explanation: 'O tabernáculo no deserto era uma figura de Cristo habitando entre o Seu povo. Cada detalhe de sua construção apontava para aspectos da pessoa e obra de Cristo. Hoje, Deus não habita em templos feitos por mãos, mas em cada crente individualmente e na assembleia reunida ao nome de Jesus.',
      authorId: autoresMap.get('c-h-mackintosh')!.id,
      tags: ['tabernáculo', 'tipologia', 'presença de deus'],
      scheduledFor: getNextDate(startDate, 12)
    },
    {
      verse: 'Números 21:9',
      text: 'Assim Moisés fez uma serpente de bronze, e pô-la sobre uma haste; e sucedia que, quando alguma serpente mordia alguém, e esse olhava para a serpente de bronze, ficava vivo.',
      explanation: 'A serpente de bronze é uma clara figura de Cristo na cruz. O bronze fala de juízo, e a haste da cruz. Assim como os israelitas mordidos pelas serpentes (figura do pecado) eram curados ao olhar para a serpente levantada, nós somos salvos ao olhar pela fé para Cristo crucificado. Não há cura em nossos próprios esforços, apenas em olhar para Ele.',
      authorId: autoresMap.get('c-h-mackintosh')!.id,
      tags: ['serpente de bronze', 'cruz', 'salvação pela fé'],
      scheduledFor: getNextDate(startDate, 13)
    },

    // Versículos adicionais de Mario Persona (para completar)
    {
      verse: 'João 14:6',
      text: 'Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim.',
      explanation: 'Jesus não é apenas um caminho entre muitos, mas O ÚNICO caminho para o Pai. Não há contradição mais clara com o pluralismo religioso moderno do que esta declaração exclusiva de Cristo. Ele é a verdade encarnada, não apenas um mestre da verdade, e a própria vida eterna personificada.',
      authorId: autoresMap.get('mario-persona')!.id,
      tags: ['caminho', 'verdade', 'vida', 'exclusividade de cristo'],
      scheduledFor: getNextDate(startDate, 14)
    },
    {
      verse: 'Romanos 5:8',
      text: 'Mas Deus prova o seu amor para conosco, em que Cristo morreu por nós, sendo nós ainda pecadores.',
      explanation: 'Deus não esperou que nos tornássemos bons ou merecedores para nos amar. Pelo contrário, quando ainda éramos pecadores, inimigos, indignos - foi exatamente nessa condição que Cristo morreu por nós. Esta é a prova incontestável do amor de Deus: não pelo que somos, mas pelo que Ele é.',
      authorId: autoresMap.get('mario-persona')!.id,
      tags: ['amor de deus', 'morte de cristo', 'pecadores'],
      scheduledFor: getNextDate(startDate, 15)
    }
  ]

  // Criar os versículos
  let versesCreated = 0
  for (const verse of verses) {
    try {
      // Verificar se já existe um versículo com a mesma referência para a mesma data (aproximadamente)
      // Para evitar duplicatas, vamos apenas criar
      await prisma.dailyVerse.create({ data: verse })
      console.log(`✅ Versículo criado: ${verse.verse} - ${verse.authorId ? 'Autor ID: ' + verse.authorId : ''}`)
      versesCreated++
    } catch (error) {
      console.error(`❌ Erro ao criar versículo ${verse.verse}:`, error)
    }
  }

  console.log(`📊 Versículos criados: ${versesCreated}`)

  // Estatísticas finais
  const totalFrases = await prisma.dailyVerse.count()
  const totalAutores = await prisma.author.count()
  const totalDoutrinas = await prisma.doctrine.count()
  const totalPerguntas = await prisma.questionAnswer.count()

  console.log('\n📈 Estatísticas finais da plataforma:')
  console.log(`   - Autores: ${totalAutores}`)
  console.log(`   - Doutrinas: ${totalDoutrinas}`)
  console.log(`   - Perguntas e Respostas: ${totalPerguntas}`)
  console.log(`   - Frases Diárias: ${totalFrases}`)

  console.log('\n🎉 Seed de autores e frases diárias concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })