    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profilePicture: { type: String, default: '/defaultpfp.png' },
        role: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        projects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Project'
            }
        ],
        tickets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ticket'
            }
        ],
        skills: [
            {
                type: String,
                enum: [
                    'JavaScript',
                    'Python',
                    'C++',
                    'Java',
                    'Ruby',
                    'PHP',
                    'C#',
                    'Swift',
                    'Go',
                    'TypeScript',
                    'Shell Scripting',
                    'SQL',
                    'NoSQL',
                    'Cloud Services',
                    'Containerization',
                    'CI/CD',
                    'Front-end Frameworks',
                    'Back-end Frameworks',
                    'Mobile App Development',
                    'Unit Testing',
                    'Integration Testing',
                    'System Testing',
                    'Agile Methodologies',
                    'Project Management',
                    'Version Control/Git',
                    'HTML/CSS',
                    'UI/UX Design',
                    'Security Principles',
                    'DevOps',
                    'Problem Solving',
                    'Debugging',
                    'Rust',
                    'Kotlin',
                    'React Native',
                    'Flutter',
                    'Vue.js',
                    'Angular.js',
                    'Django',
                    'Flask',
                    'Spring Boot',
                    'ASP.NET',
                    'Laravel',
                    'TensorFlow',
                    'PyTorch',
                    'PostgreSQL',
                    'MongoDB',
                    'MariaDB',
                    'SQLite',
                    'CouchDB',
                    'Firebase',
                    'Oracle',
                    'Machine Learning',
                    'Data Analysis',
                    'Natural Language Processing',
                    'Image Processing',
                    'Microservices',
                    'Blockchain',
                    'Cybersecurity',
                    'Web Scraping'
                ],
                default: []
            }
        ]

    });

    module.exports = mongoose.model('User', userSchema);
