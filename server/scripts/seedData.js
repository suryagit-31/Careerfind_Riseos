import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Job from "../models/Job.js";

dotenv.config();

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB", process.env.MONGODB_URI);
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://suryadammalapa:wajWWphveFqeXz2Q@careerfinder.zgjx3mw.mongodb.net/Carrerfind"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log("Cleared existing data");

    // Create sample users
    const hashedPassword = await bcrypt.hash("123456", 12);

    const users = await User.create([
      {
        name: "John Smith",
        email: "john@example.com",
        password: hashedPassword,
      },
      {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        password: hashedPassword,
      },
      {
        name: "Mike Chen",
        email: "mike@example.com",
        password: hashedPassword,
      },
      {
        name: "Emily Davis",
        email: "emily@example.com",
        password: hashedPassword,
      },
    ]);

    console.log("Created sample users");

    // Create sample jobs
    const sampleJobs = [
      {
        title: "Senior Frontend Developer",
        description:
          "We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building and maintaining modern web applications using React, TypeScript, and other cutting-edge technologies. The ideal candidate has strong problem-solving skills and experience with responsive design.",
        skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
        location: "San Francisco, CA",
        salary: "$120,000 - $150,000",
        tags: ["remote", "fulltime", "senior"],
        author: users[0]._id,
      },
      {
        title: "Full Stack Engineer",
        description:
          "Join our startup as a Full Stack Engineer and help build the next generation of fintech solutions. You'll work with Node.js, Python, React, and cloud technologies to create scalable applications that serve millions of users.",
        skills: ["Node.js", "Python", "React", "MongoDB", "AWS"],
        location: "New York, NY",
        salary: "$100,000 - $130,000",
        tags: ["startup", "fintech", "fulltime"],
        author: users[1]._id,
      },
      {
        title: "DevOps Engineer",
        description:
          "Looking for a DevOps Engineer to optimize our infrastructure and deployment processes. Experience with Kubernetes, Docker, and CI/CD pipelines is essential. You'll work closely with development teams to ensure smooth and reliable deployments.",
        skills: ["Kubernetes", "Docker", "AWS", "Jenkins", "Terraform"],
        location: "Austin, TX",
        budget: 85000,
        tags: ["devops", "infrastructure", "remote"],
        author: users[2]._id,
      },
      {
        title: "UI/UX Designer",
        description:
          "We need a creative UI/UX Designer to design intuitive and beautiful user interfaces for our mobile and web applications. Strong portfolio required, along with expertise in Figma, user research, and design systems.",
        skills: [
          "Figma",
          "Adobe Creative Suite",
          "User Research",
          "Prototyping",
        ],
        location: "Los Angeles, CA",
        salary: "$80,000 - $100,000",
        tags: ["design", "creative", "hybrid"],
        author: users[0]._id,
      },
      {
        title: "Data Scientist",
        description:
          "Seeking a Data Scientist to analyze large datasets and build machine learning models that drive business decisions. Experience with Python, SQL, and statistical analysis is required. Background in healthcare data is a plus.",
        skills: ["Python", "SQL", "Machine Learning", "Statistics", "Pandas"],
        location: "Boston, MA",
        salary: "$110,000 - $140,000",
        tags: ["data", "ml", "healthcare"],
        author: users[3]._id,
      },
      {
        title: "Mobile App Developer",
        description:
          "Join our mobile team to build cross-platform applications using React Native. You'll be responsible for developing new features, optimizing performance, and ensuring great user experiences on both iOS and Android.",
        skills: ["React Native", "JavaScript", "iOS", "Android", "Firebase"],
        location: "Seattle, WA",
        budget: 95000,
        tags: ["mobile", "react-native", "remote"],
        author: users[1]._id,
      },
      {
        title: "Backend Developer",
        description:
          "We're looking for a Backend Developer to build robust APIs and microservices. Experience with Go, PostgreSQL, and distributed systems is preferred. You'll work on high-performance systems that handle millions of requests.",
        skills: ["Go", "PostgreSQL", "Redis", "Microservices", "Docker"],
        location: "Denver, CO",
        salary: "$90,000 - $120,000",
        tags: ["backend", "microservices", "performance"],
        author: users[2]._id,
      },
      {
        title: "Product Manager",
        description:
          "Looking for an experienced Product Manager to lead our e-commerce platform development. You'll work with engineering, design, and marketing teams to define product roadmaps and drive feature development.",
        skills: [
          "Product Strategy",
          "Agile",
          "User Stories",
          "Analytics",
          "A/B Testing",
        ],
        location: "Chicago, IL",
        salary: "$130,000 - $160,000",
        tags: ["product", "ecommerce", "leadership"],
        author: users[0]._id,
      },
      {
        title: "Cybersecurity Analyst",
        description:
          "Join our security team to protect our infrastructure and applications from threats. Experience with penetration testing, security audits, and incident response is required. Security certifications are a plus.",
        skills: [
          "Penetration Testing",
          "Security Audits",
          "Incident Response",
          "CISSP",
          "Network Security",
        ],
        location: "Washington, DC",
        budget: 105000,
        tags: ["security", "cybersecurity", "government"],
        author: users[3]._id,
      },
      {
        title: "QA Engineer",
        description:
          "We need a QA Engineer to ensure our software meets the highest quality standards. Experience with automated testing frameworks, test planning, and bug tracking is essential. Knowledge of performance testing is a plus.",
        skills: [
          "Selenium",
          "Jest",
          "Test Planning",
          "Bug Tracking",
          "Performance Testing",
        ],
        location: "Remote",
        salary: "$70,000 - $90,000",
        tags: ["qa", "testing", "remote", "automation"],
        author: users[1]._id,
      },
    ];

    const jobs = await Job.create(sampleJobs);
    console.log(`Created ${jobs.length} sample jobs`);

    console.log("Database seeded successfully!");
    console.log("\nSample login credentials:");
    console.log("Email: john@example.com, Password: 123456");
    console.log("Email: sarah@example.com, Password: 123456");
    console.log("Email: mike@example.com, Password: 123456");
    console.log("Email: emily@example.com, Password: 123456");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
