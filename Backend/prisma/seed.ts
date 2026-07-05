import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('SkillifyDemo!23', 12);

  // 1. Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillify.dev' },
    update: { fullName: 'Skillify Admin', username: 'admin', passwordHash, role: 'ADMIN', emailVerified: true },
    create: {
      email: 'admin@skillify.dev',
      fullName: 'Skillify Admin',
      username: 'admin',
      passwordHash,
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@skillify.dev' },
    update: { fullName: 'Alex Johnson', username: 'demo', passwordHash, emailVerified: true },
    create: {
      email: 'demo@skillify.dev',
      fullName: 'Alex Johnson',
      username: 'demo',
      passwordHash,
      role: 'USER',
      emailVerified: true,
    },
  });

  const sarahUser = await prisma.user.upsert({
    where: { email: 'sarah.chen@skillify.dev' },
    update: { fullName: 'Sarah Chen', username: 'sarah', passwordHash, emailVerified: true },
    create: {
      email: 'sarah.chen@skillify.dev',
      fullName: 'Sarah Chen',
      username: 'sarah',
      passwordHash,
      role: 'USER',
      emailVerified: true,
    },
  });

  const priyaUser = await prisma.user.upsert({
    where: { email: 'priya.sharma@skillify.dev' },
    update: { fullName: 'Priya Sharma', username: 'priya', passwordHash, emailVerified: true },
    create: {
      email: 'priya.sharma@skillify.dev',
      fullName: 'Priya Sharma',
      username: 'priya',
      passwordHash,
      role: 'USER',
      emailVerified: true,
    },
  });

  // 2. Profiles
  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      bio: 'Software Engineer transitioning to Product Management',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexjohnson',
      github: 'github.com/alexjohnson',
      portfolio: 'alexjohnson.dev',
      skills: 'JavaScript, TypeScript, React, Node.js, Python, AWS, Product Strategy, Agile',
    },
  });

  await prisma.profile.upsert({
    where: { userId: sarahUser.id },
    update: {},
    create: {
      userId: sarahUser.id,
      bio: 'Product Manager at Google',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/sarahchen',
      skills: 'Product Management, Roadmapping, Agile, UX Design',
    },
  });

  // 3. Goals
  const goals = [
    { title: 'Update Resume', completed: true },
    { title: 'Apply to 5 jobs', completed: true },
    { title: 'Complete AI assessment', completed: false },
    { title: 'Network with 3 professionals', completed: false },
  ];

  for (const g of goals) {
    await prisma.goal.create({
      data: {
        userId: demoUser.id,
        title: g.title,
        completed: g.completed,
      },
    });
  }

  // 4. Career Matches
  const careerMatches = [
    { title: 'Product Manager', company: 'Tech Giants', match: 94, salary: '$120K - $180K' },
    { title: 'UX Designer', company: 'Design Studios', match: 89, salary: '$90K - $140K' },
    { title: 'Data Analyst', company: 'Analytics Co', match: 85, salary: '$80K - $120K' },
  ];

  for (const cm of careerMatches) {
    await prisma.careerMatch.create({
      data: {
        userId: demoUser.id,
        title: cm.title,
        company: cm.company,
        match: cm.match,
        salary: cm.salary,
      },
    });
  }

  // 5. Dashboard Stats (Last 7 days, Mon to Sun)
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Seed some pseudo-random values for weekly analytics
    const apps = [4, 6, 8, 5, 10, 3, 7][6 - i];
    const views = [12, 18, 24, 15, 30, 9, 21][6 - i];
    const matches = [2, 4, 5, 3, 7, 2, 4][6 - i];

    await prisma.dashboardStats.create({
      data: {
        userId: demoUser.id,
        date: d,
        applications: apps,
        views: views,
        matches: matches,
      },
    });
  }

  // 6. Community Posts
  const post1 = await prisma.communityPost.create({
    data: {
      userId: sarahUser.id,
      title: 'How I transitioned from Engineering to Product Management',
      content: 'After 5 years as a software engineer, I made the switch to PM. Here are the key things that helped me: 1. Focus on outcomes rather than technical output. 2. Understand user personas and collaborate with design. 3. Learn to say no and prioritize features strategically. AMA!',
      likesCount: 234,
    },
  });

  const post2 = await prisma.communityPost.create({
    data: {
      userId: demoUser.id,
      title: "My resume got me interviews at FAANG - here's the format I used",
      content: "I've reviewed hundreds of resumes and noticed patterns that work. The key is to focus on impact and use the STAR method. Keep it to one page, highlight your tech stack clearly, and link to your GitHub. What questions do you have?",
      likesCount: 567,
    },
  });

  // 7. Comments
  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: demoUser.id,
      content: 'This is super helpful! How did you handle the lack of product design experience initially?',
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: priyaUser.id,
      content: 'Sarah, did you take any certifications or did you just apply internally?',
    },
  });

  // 8. Notifications
  const notifications = [
    { type: 'resume', title: 'Resume updated', message: 'Your resume has been optimized by AI' },
    { type: 'career', title: 'New career match found', message: 'Product Manager match is 94%' },
    { type: 'skill', title: 'Skill assessment completed', message: 'You passed the TypeScript exam' },
    { type: 'achievement', title: 'Badge earned: Resume Pro', message: 'Created 3+ resumes' },
  ];

  for (const n of notifications) {
    await prisma.notification.create({
      data: {
        userId: demoUser.id,
        type: n.type,
        title: n.title,
        message: n.message,
      },
    });
  }

  // 9. Skills & Courses
  const skillTs = await prisma.skill.upsert({
    where: { id: 'seed_skill_typescript' },
    update: {},
    create: {
      id: 'seed_skill_typescript',
      title: 'TypeScript',
      description: 'Typed JavaScript for large applications.',
    },
  });

  const skillNode = await prisma.skill.upsert({
    where: { id: 'seed_skill_node' },
    update: {},
    create: {
      id: 'seed_skill_node',
      title: 'Node.js',
      description: 'Server-side JavaScript runtime.',
    },
  });

  const courseApi = await prisma.course.upsert({
    where: { id: 'seed_course_api_design' },
    update: {},
    create: {
      id: 'seed_course_api_design',
      title: 'REST API Design',
      description: 'Design robust REST APIs with Express and Prisma.',
      skillId: skillTs.id,
    },
  });

  const courseNode = await prisma.course.upsert({
    where: { id: 'seed_course_node_fundamentals' },
    update: {},
    create: {
      id: 'seed_course_node_fundamentals',
      title: 'Node Fundamentals',
      description: 'Events, streams, and the module system.',
      skillId: skillNode.id,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: demoUser.id, courseId: courseApi.id },
    },
    update: {},
    create: {
      userId: demoUser.id,
      courseId: courseApi.id,
    },
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
