import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Code2, Database, ExternalLink, Github, Globe, Linkedin, Mail, Network, Send, Server, Workflow, Briefcase, Rocket, Boxes, Container } from 'lucide-react';
import { motion } from 'motion/react';
import profileImage from './assets/profile.png';
import { getAdminMessages, getExportUrl, getPortfolioData, submitContactForm } from './lib/api';
import { SectionHeading } from './components/SectionHeading';
import { AdminDashboard } from './components/AdminDashboard';
import type { AdminMessagesResponse, PortfolioData } from './types';

const skillIcons = [Code2, Server, Network, Boxes, Container, Rocket, Database, Workflow];
const contactIconMap = {
  Email: Mail,
  LinkedIn: Linkedin,
  GitHub: Github,
} as const;

const fallbackData: PortfolioData = {
  hero: {
    name: 'Mohanreddy Rondla',
    title: 'Java Backend Developer',
    tagline: 'Building scalable APIs and distributed systems that power modern applications.',
  },
  about: {
    paragraphs: [
      "I'm a passionate Java Backend Developer specializing in building robust, scalable, and high-performance distributed systems.",
      'My expertise lies in designing RESTful APIs, implementing event-driven architectures with Kafka, and orchestrating containerized applications with Docker and Kubernetes.',
    ],
    cards: [
      { title: '1+ Years', description: 'Professional Experience' },
      { title: '10+ Projects', description: 'Successfully Delivered' },
    ],
  },
  skills: [
    { name: 'Java', description: 'Core Language' },
    { name: 'Spring Boot', description: 'Framework' },
    { name: 'Microservices', description: 'Architecture' },
    { name: 'REST APIs', description: 'Web Services' },
  ],
  projects: [],
  experience: [],
  contact: {
    intro: 'Open to discussing new projects, ideas, and backend engineering opportunities.',
    links: [],
  },
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function App() {
  const [data, setData] = useState<PortfolioData>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [adminData, setAdminData] = useState<AdminMessagesResponse | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    getPortfolioData()
      .then((portfolio) => setData(portfolio))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const heroTagline = useMemo(() => data.hero.tagline, [data.hero.tagline]);


  async function handleLoadAdminMessages() {
    setAdminLoading(true);
    setAdminError(null);

    try {
      const response = await getAdminMessages(adminKey);
      setAdminData(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load admin messages';
      setAdminError(message);
    } finally {
      setAdminLoading(false);
    }
  }

  function getAdminExportLink(format: 'json' | 'csv') {
    return getExportUrl(adminKey, format);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      const response = await submitContactForm(form);
      setForm({ name: '', email: '', subject: '', message: '' });
      setFormStatus({ type: 'success', message: response.message });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit the form';
      setFormStatus({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-blue-950 text-white relative overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl w-full text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-block mb-8">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 blur-lg opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-xl shadow-2xl">
                    <img src={profileImage} alt={data.hero.name} className="h-48 w-48 rounded-full object-cover" />
                  </div>
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                {data.hero.name}
              </motion.h1>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl px-8 py-3 inline-block mb-6 shadow-xl">
                <h2 className="text-2xl md:text-3xl text-purple-300 font-light">{data.hero.title}</h2>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
                {heroTagline}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button onClick={() => scrollToSection('projects')} className="group relative px-8 py-4 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:scale-105"></div>
                  <span className="relative text-white font-medium text-lg">View Projects</span>
                </button>
                <button onClick={() => scrollToSection('contact')} className="group relative px-8 py-4 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 backdrop-blur-xl bg-white/10 border border-white/20 transition-all duration-300 group-hover:bg-white/20"></div>
                  <span className="relative text-white font-medium text-lg">Contact Me</span>
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }} className="mt-16">
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                  <ChevronDown className="w-8 h-8 text-white/50" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="About Me" />
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl hover:bg-white/10 transition-all duration-300">
              {data.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6 last:mb-0">{paragraph}</p>
              ))}
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {data.about.cards.map((card, index) => (
                <motion.div key={card.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl hover:bg-white/10 transition-all duration-300">
                    <Briefcase className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-3xl font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-gray-400">{card.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="Technical Skills" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.skills.map((skill, index) => {
                const Icon = skillIcons[index % skillIcons.length];
                return (
                  <motion.div key={skill.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-0 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl hover:bg-white/10 transition-all duration-300 h-full flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-purple-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{skill.name}</h3>
                      <p className="text-gray-400 text-sm">{skill.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="Featured Projects" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((project, index) => (
                <motion.div key={project.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.1 }} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4 gap-4">
                      <h3 className="text-2xl font-bold text-white flex-1">{project.title}</h3>
                      <div className="flex gap-2">
                        <a href={project.github} target="_blank" rel="noreferrer" className="p-2 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all duration-300">
                          <Github className="w-5 h-5 text-purple-300" />
                        </a>
                        {project.demo ? (
                          <a href={project.demo} target="_blank" rel="noreferrer" className="p-2 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all duration-300">
                            <Globe className="w-5 h-5 text-purple-300" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-xl backdrop-blur-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-sm">{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <a href={project.github} target="_blank" rel="noreferrer" className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all duration-300 justify-center">
                        <Github className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">Source Code</span>
                      </a>
                      {project.demo ? (
                        <a href={project.demo} target="_blank" rel="noreferrer" className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-all duration-300 justify-center">
                          <ExternalLink className="w-5 h-5 text-white" />
                          <span className="text-white font-medium">Live Demo</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="Experience" />
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-600 via-blue-600 to-purple-600"></div>
              <div className="space-y-12">
                {data.experience.map((exp, index) => (
                  <motion.div key={`${exp.company}-${exp.year}`} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.2 }} className={`relative flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 border-4 border-black shadow-lg shadow-purple-500/50"></div>
                    <div className="w-full md:w-5/12">
                      <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                            <Briefcase className="w-6 h-6 text-purple-300" />
                          </div>
                          <div className="inline-block backdrop-blur-xl bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-2 mb-4"><span className="text-purple-200 font-medium">{exp.year}</span></div>
                          <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                          <h4 className="text-lg text-purple-300 mb-4">{exp.company}</h4>
                          <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement) => (
                              <li key={achievement} className="flex items-center gap-2 text-gray-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block w-5/12"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <AdminDashboard
          adminKey={adminKey}
          setAdminKey={setAdminKey}
          adminData={adminData}
          adminError={adminError}
          adminLoading={adminLoading}
          onLoadMessages={handleLoadAdminMessages}
          getExportLink={getAdminExportLink}
        />

        <section id="contact" className="py-20 px-4 pb-32">
          <div className="max-w-5xl mx-auto">
            <SectionHeading title="Get In Touch" />
            <p className="text-gray-300 text-lg max-w-2xl mx-auto text-center mb-12">{data.contact.intro}</p>

            {error ? <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-amber-200 text-center">API fallback active: {error}</div> : null}
            {loading ? <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-gray-300">Loading portfolio data...</div> : null}

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-semibold mb-6">Direct contact</h3>
                  <div className="space-y-5">
                    {data.contact.links.map((link) => {
                      const Icon = contactIconMap[link.label as keyof typeof contactIconMap] ?? Mail;
                      return (
                        <a key={`${link.label}-${link.value}`} href={link.href} target="_blank" rel="noreferrer" className="group/link flex items-center gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover/link:scale-110 transition-transform duration-300">
                            <Icon className="w-6 h-6 text-purple-300" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-400">{link.label}</div>
                            <div className="text-white font-medium">{link.value}</div>
                          </div>
                          <Send className="w-5 h-5 text-purple-300 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-5">
                  <h3 className="text-2xl font-semibold">Send a message</h3>
                  <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required placeholder="Your name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-purple-400" />
                  <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required placeholder="Email address" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-purple-400" />
                  <input value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} required placeholder="Subject" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-purple-400" />
                  <textarea value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} required rows={6} placeholder="Tell me about your project or opportunity" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-purple-400 resize-none" />
                  {formStatus.type ? (
                    <div className={`rounded-2xl p-4 text-sm ${formStatus.type === 'success' ? 'bg-emerald-500/10 border border-emerald-400/30 text-emerald-200' : 'bg-red-500/10 border border-red-400/30 text-red-200'}`}>
                      {formStatus.message}
                    </div>
                  ) : null}
                  <button disabled={submitting} className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer">
                    {submitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </motion.form>
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.8 }} className="text-center mt-16">
              <p className="text-gray-400">© 2026 {data.hero.name}</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
