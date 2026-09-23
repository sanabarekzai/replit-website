import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Route, Switch, useLocation } from 'wouter';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight,
  CircleUserRound, Clock3, ExternalLink, Laptop,
  LayoutDashboard, Mail, Menu, MessageCircle, Play, Send, Sparkles,
  X, LockKeyhole, Quote, Target, Wifi, XCircle
} from 'lucide-react';
import {
  ContactSubmissionInputReason,
  getGetAdminMessagesQueryKey,
  getGetAdminSummaryQueryKey,
  useAdminLogin,
  useCreateContactSubmission,
  useGetAdminMessages,
  useGetAdminSummary,
  useHealthCheck,
  useMarkAdminMessageReplied,
} from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const navItems = [
  { href: '/', label: 'Home', short: '01' },
  { href: '/media', label: 'Media', short: '02' },
  { href: '/future', label: 'Future', short: '03' },
  { href: '/creative-work', label: 'Creative work', short: '04' },
  { href: '/learning-journey', label: 'Learning journey', short: '05' },
  { href: '/admin', label: 'Admin', short: '06' },
];

const mediaItems = [
  { id: 'dubai', type: 'Image', title: 'Dubai', text: 'A photo album entry from Dubai.', image: 'https://images.pexels.com/photos/30554306/pexels-photo-30554306.jpeg', tone: 'from-[#e8d8b3] to-[#fca590]', animated: false },
  { id: 'dreamy-place', type: 'Image', title: 'Dreamy place', text: 'A dreamy place from the previous photo album.', image: 'https://static.vecteezy.com/system/resources/thumbnails/041/448/144/small/ai-generated-beautiful-landscape-scenery-nature-professionalgraphy-photo.jpg', tone: 'from-[#fca590] to-[#e8d8b3]', animated: false },
  { id: 'ucla', type: 'Image', title: 'UCLA university', text: 'A photo album entry from UCLA university.', image: 'https://images.pexels.com/photos/34304261/pexels-photo-34304261.jpeg', tone: 'from-[#e8d8b3] to-[#fca590]', animated: false },
  { id: 'hiking', type: 'Image', title: 'Hiking', text: 'A hiking photo from the previous album.', image: 'https://images.pexels.com/photos/27681035/pexels-photo-27681035.jpeg', tone: 'from-[#fca590] to-[#e8d8b3]', animated: false },
  { id: 'mantu', type: 'Image', title: 'Mantu', text: 'A photo album entry featuring mantu.', image: 'https://images.pexels.com/photos/32705658/pexels-photo-32705658.jpeg', tone: 'from-[#e8d8b3] to-[#fca590]', animated: false },
  { id: 'basketball', type: 'Image', title: 'Basketball', text: 'A basketball photo from the previous album.', image: 'https://images.pexels.com/photos/27857312/pexels-photo-27857312.jpeg', tone: 'from-[#fca590] to-[#e8d8b3]', animated: false },
  { id: 'video', type: 'Video', title: 'Caitlin Clark is my main inspiration', text: 'In my opinion, Caitlin Clark is the best WNBA basketball player. Every move she makes shows how fierce, focused, and strong she is.', image: 'https://img.youtube.com/vi/rBJVrezf6uo/hqdefault.jpg', tone: 'from-[#e8d8b3] to-[#fca590]', animated: false },
  { id: 'cadillac', type: 'Image', title: 'Cadillac', text: 'A Cadillac photo from the previous album.', image: 'https://images.pexels.com/photos/36591054/pexels-photo-36591054.jpeg', tone: 'from-[#fca590] to-[#e8d8b3]', animated: false },
  { id: 'cute-cat', type: 'Image', title: 'Cute cat', text: 'A cute cat photo from the previous album.', image: 'https://images.pexels.com/photos/36594706/pexels-photo-36594706.jpeg', tone: 'from-[#e8d8b3] to-[#fca590]', animated: false },
];

const videoEmbedUrl = 'https://www.youtube.com/embed/rBJVrezf6uo?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1';

function IconButton({ label, children, onClick, className = '' }: { label: string; children: ReactNode; onClick?: () => void; className?: string }) {
  return <button type="button" aria-label={label} data-testid={`button-${label.toLowerCase().replaceAll(' ', '-')}`} onClick={onClick} className={`focus-ring ${className}`}>{children}</button>;
}

function SiteNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-[hsl(var(--border)/.8)] bg-[hsl(var(--background)/.9)] backdrop-blur-xl">
      <div className="page-wrap flex min-h-[72px] items-center justify-between gap-5">
        <Link href="/" className="focus-ring group flex shrink-0 items-center gap-3 no-underline" data-testid="link-brand">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--primary))] font-serif text-lg text-[hsl(var(--primary-foreground))]">S</span>
          <span className="font-serif text-xl tracking-[-.03em]">Sana Barekzai</span>
        </Link>
        <IconButton label="open navigation" onClick={() => setOpen(!open)} className="rounded-full p-2 md:hidden">
          {open ? <X size={21} /> : <Menu size={21} />}
        </IconButton>
        <nav className={`${open ? 'absolute left-0 right-0 top-[72px] flex border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3' : 'hidden'} flex-col gap-1 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`} aria-label="Main navigation">
          {navItems.map((item) => {
            const active = item.href === '/' ? location === '/' : location.startsWith(item.href);
            return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`nav-link focus-ring flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[.12em] no-underline ${active ? 'active' : 'text-[hsl(var(--muted-foreground))]'}`} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              <span className="font-mono text-[10px] opacity-55">{item.short}</span>{item.label}
            </Link>;
          })}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return <footer className="mt-24 border-t border-[hsl(var(--border))] py-10">
    <div className="page-wrap flex flex-col justify-between gap-5 text-sm text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center">
      <p data-testid="text-footer-note">A personal website by Sana Barekzai. Built while learning.</p>
      <div className="flex items-center gap-4">
        <a href="mailto:sanabarekzai2011@gmail.com" className="ink-link focus-ring" data-testid="link-footer-email">Email Sana</a>
        <span className="font-mono text-xs">© {new Date().getFullYear()}</span>
      </div>
    </div>
  </footer>;
}

function PageTitle({ kicker, title, intro }: { kicker: string; title: ReactNode; intro: string }) {
  return <div className="page-enter mb-12 max-w-3xl">
    <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.18em] text-[hsl(var(--accent))]" data-testid={`text-kicker-${kicker.toLowerCase().replaceAll(' ', '-')}`}><span className="h-px w-8 bg-[hsl(var(--primary))]" />{kicker}</div>
    <h1 className="font-serif text-5xl leading-[.95] tracking-[-.055em] sm:text-7xl" data-testid={`heading-${kicker.toLowerCase().replaceAll(' ', '-')}`}>{title}</h1>
    <p className="mt-6 max-w-xl text-lg leading-8 text-[hsl(var(--muted-foreground))]" data-testid={`text-intro-${kicker.toLowerCase().replaceAll(' ', '-')}`}>{intro}</p>
  </div>;
}

function StatusPill({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'warm' | 'teal' }) {
  const color = tone === 'warm' ? 'bg-[hsl(var(--secondary)/.55)] text-[hsl(var(--foreground))]' : tone === 'teal' ? 'bg-[hsl(var(--accent)/.12)] text-[hsl(var(--accent))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]';
  return <span className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[.13em] ${color}`}>{children}</span>;
}

function MediaPlaceholder({ label, detail, className = '' }: { label: string; detail: string; className?: string }) {
  return <div className={`flex flex-col items-center justify-center gap-3 bg-[hsl(var(--secondary)/.45)] p-6 text-center ${className}`} role="img" aria-label={`${label} placeholder`}>
    <span className="rounded-full border border-[hsl(var(--foreground)/.2)] px-3 py-1 font-mono text-[10px] uppercase tracking-[.14em]">Placeholder</span>
    <span className="font-serif text-2xl leading-none tracking-[-.04em]">{label}</span>
    <span className="max-w-xs text-xs leading-5 text-[hsl(var(--foreground)/.65)]">{detail}</span>
  </div>;
}

function ContactForm() {
  const createContact = useCreateContactSubmission({ request: { credentials: 'include' } });
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', reason: ContactSubmissionInputReason.Comment, message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault(); setError(''); setSent(false);
    createContact.mutate({ data: form }, { onSuccess: () => { setSent(true); setForm({ firstName: '', lastName: '', email: '', reason: ContactSubmissionInputReason.Comment, message: '' }); }, onError: () => setError('That message did not send. Please try once more.') });
  };
  return <form onSubmit={submit} className="paper-card rounded-[1.5rem] p-5 sm:p-8" data-testid="form-contact">
    <div className="mb-7 flex items-start justify-between gap-5"><div><StatusPill tone="warm">Open inbox</StatusPill><h3 className="mt-3 font-serif text-3xl tracking-[-.04em]" data-testid="heading-contact-form">Leave a note</h3></div><Send className="text-[hsl(var(--primary))]" size={22} /></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold">First name<input required className="input-field mt-2" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} data-testid="input-first-name" /></label>
      <label className="text-sm font-semibold">Last name<input required className="input-field mt-2" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} data-testid="input-last-name" /></label>
    </div>
    <label className="mt-4 block text-sm font-semibold">Email<input required type="email" className="input-field mt-2" value={form.email} onChange={(e) => update('email', e.target.value)} data-testid="input-contact-email" /></label>
    <label className="mt-4 block text-sm font-semibold">What brings you here?<select className="input-field mt-2" value={form.reason} onChange={(e) => update('reason', e.target.value)} data-testid="select-contact-reason">{Object.values(ContactSubmissionInputReason).map((reason) => <option key={reason} value={reason}>{reason}</option>)}</select></label>
    <label className="mt-4 block text-sm font-semibold">Your message<textarea required minLength={1} rows={4} className="input-field mt-2 resize-y" value={form.message} onChange={(e) => update('message', e.target.value)} data-testid="textarea-contact-message" /></label>
    {sent && <p className="mt-4 flex items-center gap-2 text-sm text-[hsl(var(--accent))]" role="status" data-testid="status-contact-success"><Check size={16} /> Message received. I will read it soon.</p>}
    {error && <p className="mt-4 flex items-center gap-2 text-sm text-[hsl(var(--destructive))]" role="alert" data-testid="status-contact-error"><XCircle size={16} /> {error}</p>}
    <button disabled={createContact.isPending} className="button-lift focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-55" type="submit" data-testid="button-send-message">{createContact.isPending ? 'Sending…' : 'Send message'} <ArrowUpRight size={16} /></button>
  </form>;
}

function Home() {
  const health = useHealthCheck();
  return <PageFrame>
    <main className="page-wrap page-enter">
      <section className="grid items-center gap-10 pb-20 pt-12 md:grid-cols-[1.1fr_.9fr] md:gap-20 md:pt-20">
        <div>
          <div className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.2em] text-[hsl(var(--accent))]" data-testid="text-home-kicker"><span className="h-px w-9 bg-[hsl(var(--primary))]" /> Student web designer</div>
          <h1 className="max-w-3xl font-serif text-[clamp(4rem,11vw,8.7rem)] leading-[.82] tracking-[-.075em]" data-testid="heading-home">Sana<br /><span className="ml-[.14em] text-[hsl(var(--primary))]">Barekzai.</span></h1>
          <p className="mt-9 max-w-lg text-xl leading-8 text-[hsl(var(--muted-foreground))]" data-testid="text-home-tagline">I am learning how to create websites.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="button-lift focus-ring inline-flex items-center gap-2 rounded-full bg-[hsl(var(--foreground))] px-5 py-3 text-sm font-bold text-[hsl(var(--background))] no-underline" data-testid="link-home-contact">Contact me <Mail size={16} /></a>
            <Link href="/creative-work" className="focus-ring inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3 text-sm font-bold no-underline transition-colors hover:bg-[hsl(var(--muted))]" data-testid="link-home-creative-work">See my work <ArrowDownRight size={16} /></Link>
          </div>
          <div className="mt-12 flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]" data-testid="status-health">
            <span className={`h-2 w-2 rounded-full ${health.isError ? 'bg-[hsl(var(--destructive))]' : 'bg-[hsl(var(--accent))]'}`} />
            {health.isLoading ? 'Checking the signal…' : health.isError ? 'The signal is resting' : 'The site is awake'}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="absolute -right-4 -top-5 z-10 rounded-full bg-[hsl(var(--secondary))] px-4 py-3 font-mono text-[10px] uppercase tracking-[.12em] shadow-[var(--shadow-sm)]" data-testid="text-home-note">Outstanding Student<br />El Cajon Valley Middle School</div>
          <div className="photo-frame rotate-2 rounded-[2rem] p-3 shadow-[var(--shadow-md)]"><img src="/images/sana-profile.jpeg" alt="Sana Barekzai speaking at a podium" className="h-[480px] w-full rounded-[1.35rem] object-cover object-[center_22%]" data-testid="img-sana-portrait" /></div>
          <div className="absolute -bottom-8 -left-6 flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border border-[hsl(var(--primary))] bg-[hsl(var(--background))] text-center font-mono text-[10px] uppercase leading-4 tracking-[.1em]" data-testid="text-home-stamp">made with<br />care</div>
        </div>
      </section>
      <section className="grid gap-10 border-y border-[hsl(var(--border))] py-16 md:grid-cols-[.72fr_1.28fr] md:gap-20">
        <div><StatusPill tone="teal">A little context</StatusPill><h2 className="mt-5 font-serif text-4xl leading-none tracking-[-.05em]" data-testid="heading-about-sana">A work in progress,<br />on purpose.</h2></div>
        <div className="space-y-5 text-lg leading-8 text-[hsl(var(--muted-foreground))]"><p data-testid="text-biography-1">I am a sophomore in high school. I am the president of the StudySmart club and a proud student leader.</p><p data-testid="text-biography-2">I am currently learning vibe coding and leadership skills. This is my first website, and I hope you are impressed!</p><p data-testid="text-biography-3">If you are interested in creating a website, fill out the contact form and send me a message.</p></div>
      </section>
      <section className="grid gap-8 py-20 md:grid-cols-[1fr_1.05fr] md:items-center">
        <div className="order-2 md:order-1"><StatusPill>From the media shelf</StatusPill><h2 className="mt-5 max-w-md font-serif text-5xl leading-[.95] tracking-[-.06em]" data-testid="heading-media-preview">Notes from the making of this place.</h2><p className="mt-5 max-w-md leading-7 text-[hsl(var(--muted-foreground))]" data-testid="text-media-preview">Sketches, field notes, small wins, and the occasional screenshot that proves an idea became real.</p><Link href="/media" className="ink-link focus-ring mt-7 inline-flex items-center gap-2 text-sm font-bold no-underline" data-testid="link-view-media">Browse the gallery <ArrowRight size={16} /></Link></div>
        <Link href="/media" className="media-card focus-ring order-1 block overflow-hidden rounded-[1.5rem] border border-[hsl(var(--border))] bg-[hsl(var(--accent))] no-underline md:order-2" data-testid="card-media-preview"><div className="relative h-[300px] overflow-hidden sm:h-[380px]"><MediaPlaceholder label="Your first media piece here" detail="Replace this labeled placeholder with your own image or project." className="h-full w-full bg-[hsl(var(--accent))] text-[hsl(var(--background))]" /><div className="absolute bottom-5 left-5"><StatusPill tone="warm">01 / 09</StatusPill></div></div></Link>
      </section>
      <section id="contact" className="grid scroll-mt-24 gap-10 border-t border-[hsl(var(--border))] py-20 md:grid-cols-[.8fr_1.2fr] md:gap-20">
        <div><StatusPill tone="warm">Keep in touch</StatusPill><h2 className="mt-5 font-serif text-5xl leading-[.9] tracking-[-.06em]" data-testid="heading-contact">Let’s make a<br /><span className="text-[hsl(var(--primary))]">connection.</span></h2><p className="mt-6 max-w-sm leading-7 text-[hsl(var(--muted-foreground))]" data-testid="text-contact-intro">If you are interested in having me create a website for you, fill out the contact form or email me directly.</p><a href="mailto:sanabarekzai2011@gmail.com" className="ink-link focus-ring mt-6 inline-flex items-center gap-2 text-sm font-bold no-underline" data-testid="link-email-sana"><Mail size={16} /> sanabarekzai2011@gmail.com</a><p className="mt-8 text-sm text-[hsl(var(--muted-foreground))]">No social profiles are listed yet.</p></div>
        <ContactForm />
      </section>
    </main>
  </PageFrame>;
}

function AnimatedPortraitDecor() {
  return <>
    <span className="portrait-orbit portrait-orbit-one" aria-hidden="true" />
    <span className="portrait-orbit portrait-orbit-two" aria-hidden="true" />
    <span className="portrait-spark portrait-spark-one" aria-hidden="true">✦</span>
    <span className="portrait-spark portrait-spark-two" aria-hidden="true">✧</span>
  </>;
}

function MediaPage() {
  const [selected, setSelected] = useState<typeof mediaItems[number] | null>(null);
      return <PageFrame><main className="page-wrap page-enter py-16 md:py-24"><PageTitle kicker="Media shelf" title={<>A gallery of <span className="text-[hsl(var(--primary))]">becoming.</span></>} intro="A collection of places, interests, and inspiration, with photos from Dubai, UCLA, hiking, mantu, basketball, a Cadillac, a cute cat, and a video about Caitlin Clark." />
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4"><p className="font-mono text-[11px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]" data-testid="text-media-count">09 pieces / mixed format</p><div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"><span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" /> Select any piece to look closer</div></div>
       <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">{mediaItems.map((item, index) => <button type="button" key={item.id} onClick={() => setSelected(item)} className={`media-card focus-ring group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-left no-underline ${item.animated ? 'animated-portrait-card' : ''}`} data-testid={`card-media-${item.id}`}><div className={`relative h-64 shrink-0 overflow-hidden bg-gradient-to-br ${item.tone} ${item.animated ? 'animated-portrait-stage' : ''}`}><img className={`media-art h-full w-full object-cover mix-blend-multiply opacity-80 ${item.animated ? 'animated-portrait' : ''}`} src={item.image} alt={item.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} />{item.animated && <AnimatedPortraitDecor />}{item.type === 'Video' && <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--background)/.9)] text-[hsl(var(--foreground))]"><Play size={15} fill="currentColor" /></span>}<div className="absolute left-4 top-4 z-10"><StatusPill tone={item.type === 'Video' ? 'warm' : 'teal'}>{item.animated ? 'Animated image' : item.type}</StatusPill></div></div><div className="flex flex-1 flex-col p-5"><div className="mb-3 flex items-center justify-between text-[11px] font-mono text-[hsl(var(--muted-foreground))]"><span>{String(index + 1).padStart(2, '0')}</span><ArrowUpRight className="media-arrow" size={16} /></div><h2 className="font-serif text-2xl leading-tight tracking-[-.035em]" data-testid={`text-media-title-${item.id}`}>{item.title}</h2><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{item.text}</p></div></button>)}</div>
       {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(222_29%_18%/.75)] p-4 backdrop-blur-sm" role="dialog" aria-modal="true" data-testid="dialog-media-detail"><button className="absolute inset-0 cursor-default" onClick={() => setSelected(null)} aria-label="close media detail" data-testid="button-close-media-backdrop" /><div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-[hsl(var(--card))] shadow-[var(--shadow-md)]"><IconButton label="close media detail" onClick={() => setSelected(null)} className="focus-ring absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--background)/.9)]"><X size={18} /></IconButton><div className={`relative h-72 overflow-hidden bg-gradient-to-br ${selected.tone} sm:h-96 ${selected.animated ? 'animated-portrait-stage' : ''}`}>{selected.type === 'Video' ? <iframe className="h-full w-full" src={videoEmbedUrl} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <img className={`h-full w-full object-cover mix-blend-multiply opacity-85 ${selected.animated ? 'animated-portrait' : ''}`} src={selected.image} alt={selected.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}{selected.animated && <AnimatedPortraitDecor />}</div><div className="p-6 sm:p-8"><StatusPill tone="warm">{selected.animated ? 'Animated image' : selected.type}</StatusPill><h2 className="mt-4 font-serif text-4xl tracking-[-.05em]" data-testid="text-selected-media-title">{selected.title}</h2><p className="mt-3 max-w-xl leading-7 text-[hsl(var(--muted-foreground))]" data-testid="text-selected-media-description">{selected.text}</p>{selected.type === 'Video' && <a href="https://youtu.be/rBJVrezf6uo?si=_upmNX4gBKp9t6Pu" target="_blank" rel="noreferrer" className="ink-link focus-ring mt-5 inline-flex items-center gap-2 text-sm font-bold no-underline" data-testid="link-selected-youtube">Watch on YouTube <ExternalLink size={15} /></a>}</div></div></div>}
  </main></PageFrame>;
}

function FuturePage() {
  const timeline = [{ year: '01', title: 'Build my own small businesses', text: 'Turn my ideas into real opportunities and learn what it takes to create something of my own.' }, { year: '02', title: 'Grow my network', text: 'Build meaningful connections, meet people with different experiences, and keep learning from others.' }, { year: '03', title: 'Graduate with a high GPA', text: 'Stay focused in school, work consistently, and finish high school proud of the effort I gave.' }, { year: '04', title: 'Get into a four-year university', text: 'Continue my education in a place where I can grow my knowledge, skills, and confidence.' }, { year: '05', title: 'Learn how to fly planes', text: 'Explore aviation and work toward the knowledge and training needed to fly.' }];
  return <PageFrame><main className="page-wrap page-enter py-16 md:py-24"><PageTitle kicker="Future notes" title={<>A direction, not a <span className="text-[hsl(var(--primary))]">deadline.</span></>} intro="I am building my future one goal at a time—learning, connecting, and making room for big possibilities." />
    <section className="relative overflow-hidden rounded-[1.8rem] bg-[hsl(var(--accent))] p-6 text-[hsl(var(--background))] sm:p-10"><div className="absolute -right-24 -top-32 h-80 w-80 rounded-full border border-[hsl(var(--secondary)/.4)]" /><div className="absolute right-10 top-10 h-40 w-40 rounded-full border border-[hsl(var(--secondary)/.25)]" /><div className="relative grid gap-10 md:grid-cols-[1.05fr_.95fr] md:items-end"><div><StatusPill tone="warm">The long view</StatusPill><h2 className="mt-6 max-w-2xl font-serif text-4xl leading-[.95] tracking-[-.05em] sm:text-6xl" data-testid="heading-five-year-goal">A future I am building.</h2></div><div><p className="leading-7 text-[hsl(var(--background)/.72)]" data-testid="text-long-term-goal">Right now, I am learning how to build websites and developing leadership skills through NJROTC. In five years, I hope to attend a four-year university, build businesses of my own, and learn how to fly planes.</p><Link href="/learning-journey" className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-4 py-3 text-sm font-bold text-[hsl(var(--foreground))] no-underline" data-testid="link-future-learning">See the learning behind it <ArrowRight size={16} /></Link></div></div></section>
    <section className="grid gap-12 py-20 md:grid-cols-[.7fr_1.3fr]"><div><StatusPill>Five goals, in order</StatusPill><h2 className="mt-5 font-serif text-4xl leading-none tracking-[-.05em]" data-testid="heading-future-timeline">Keep moving<br />forward.</h2><p className="mt-5 max-w-xs leading-7 text-[hsl(var(--muted-foreground))]" data-testid="text-future-timeline">These goals are not deadlines. They are steps I want to take as I learn, grow, and create my own path.</p></div><div className="relative">{timeline.map((item, index) => <div className="relative grid grid-cols-[48px_1fr] gap-5 pb-10 last:pb-0" key={item.year} data-testid={`timeline-item-${index}`}><div className="relative font-mono text-xs font-medium text-[hsl(var(--primary))]">{item.year}{index < timeline.length - 1 && <span className="timeline-line absolute left-[5px] top-7 h-full w-px" />}</div><div className="relative"><span className="timeline-dot absolute -left-[25px] top-0 h-3 w-3 rounded-full bg-[hsl(var(--primary))]" /><h3 className="font-serif text-2xl tracking-[-.035em]">{item.title}</h3><p className="mt-2 max-w-lg leading-7 text-[hsl(var(--muted-foreground))]">{item.text}</p></div></div>)}</div></section>
     <section className="grid items-center gap-8 border-t border-[hsl(var(--border))] py-16 md:grid-cols-[1.1fr_.9fr]"><div><div className="flex items-center gap-3 text-[hsl(var(--primary))]"><Quote size={26} /><span className="font-mono text-[10px] uppercase tracking-[.16em]">A note to keep</span></div><p className="mt-5 max-w-xl font-serif text-3xl leading-tight tracking-[-.04em]" data-testid="text-future-quote">“Dear future me, reaching your goals is not more important than living through the process. Stay present, keep learning, and enjoy each moment—the good ones and the difficult ones. Every step is teaching you something, so be proud of how far you have come and keep moving forward with patience and courage.”</p></div><div className="animated-portrait-stage relative h-56 overflow-hidden rounded-[1.3rem]"><img src="/images/sana-profile.jpeg" alt="Sana Barekzai in an animated portrait treatment" className="animated-portrait h-full w-full object-cover object-[center_22%]" data-testid="img-future-supporting" /><AnimatedPortraitDecor /></div></section>
  </main></PageFrame>;
}

function CreativeWorkPage() {
  return <PageFrame><main className="page-wrap page-enter py-16 md:py-24"><PageTitle kicker="Choice one / creative work" title={<>Making is my way of <span className="text-[hsl(var(--primary))]">thinking.</span></>} intro="Use this page for one topic you choose. Replace the placeholders with your own creative work, writing, images, and links." />
    <section className="grid gap-10 md:grid-cols-[1.1fr_.9fr] md:items-center"><MediaPlaceholder label="Your creative image here" detail="Replace this placeholder with a personal project image." className="h-[360px] w-full rounded-[1.5rem] sm:h-[460px]" /><div><StatusPill tone="warm">Current practice</StatusPill><h2 className="mt-5 font-serif text-4xl leading-none tracking-[-.05em]" data-testid="heading-creative-practice">Your creative topic goes here.</h2><p className="mt-5 leading-7 text-[hsl(var(--muted-foreground))]" data-testid="text-creative-practice">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Replace this paragraph with your own explanation.</p><p className="mt-4 leading-7 text-[hsl(var(--muted-foreground))]">Add a second paragraph about your process, examples, or what you want visitors to understand.</p></div></section>
    <section className="py-20"><div className="mb-8 flex items-end justify-between gap-4"><div><StatusPill>Things I’m building</StatusPill><h2 className="mt-4 font-serif text-4xl tracking-[-.05em]" data-testid="heading-creative-projects">A few open tabs.</h2></div><span className="font-mono text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">01 — 04</span></div><div className="divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">{['Project placeholder one', 'Project placeholder two', 'Project placeholder three', 'Project placeholder four'].map((title, index) => <div className="group grid gap-4 py-6 transition-colors hover:bg-[hsl(var(--muted)/.35)] sm:grid-cols-[64px_1fr_auto] sm:items-center" key={title} data-testid={`card-creative-project-${index}`}><span className="font-mono text-xs text-[hsl(var(--primary))]">0{index + 1}</span><div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--secondary)/.5)]"><LayoutDashboard size={18} /></span><div><h3 className="font-serif text-2xl tracking-[-.03em]">{title}</h3><p className="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Lorem ipsum dolor sit amet. Add a short project description here.</p></div></div><StatusPill tone={index === 0 ? 'warm' : 'default'}>Placeholder</StatusPill></div>)}</div></section>
    <section className="rounded-[1.5rem] bg-[hsl(var(--secondary)/.45)] p-7 sm:p-10"><div className="grid gap-7 md:grid-cols-[.8fr_1.2fr]"><h2 className="font-serif text-4xl leading-none tracking-[-.05em]" data-testid="heading-creative-resources">Your creative<br />toolbox.</h2><div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{['Tool placeholder one', 'Tool placeholder two', 'Tool placeholder three', 'Tool placeholder four', 'Tool placeholder five', 'Tool placeholder six'].map((tool, i) => <div className="flex items-center gap-3 border-b border-[hsl(var(--foreground)/.15)] pb-3 text-sm" key={tool} data-testid={`text-creative-tool-${i}`}><span className="font-mono text-[10px] text-[hsl(var(--primary))]">0{i + 1}</span>{tool}</div>)}</div></div></section>
  </main></PageFrame>;
}

function LearningJourneyPage() {
  const subjects = [{ icon: Laptop, title: 'Learning topic one', text: 'Lorem ipsum dolor sit amet. Replace this card with a subject, skill, or question.' }, { icon: BookOpen, title: 'Learning topic two', text: 'Lorem ipsum dolor sit amet. Add a short description in your own words.' }, { icon: Target, title: 'Learning topic three', text: 'Lorem ipsum dolor sit amet. Describe what you want to practice next.' }, { icon: Wifi, title: 'Learning topic four', text: 'Lorem ipsum dolor sit amet. Share how you want to learn or reflect.' }];
  return <PageFrame><main className="page-wrap page-enter py-16 md:py-24"><PageTitle kicker="Choice two / learning journey" title={<>Curiosity is a <span className="text-[hsl(var(--primary))]">practice.</span></>} intro="Use this page for a second topic you choose. Replace the placeholders with your own learning story, subjects, and questions." />
    <section className="grid gap-10 border-y border-[hsl(var(--border))] py-12 md:grid-cols-[.65fr_1.35fr]"><div className="font-mono text-[11px] uppercase tracking-[.16em] text-[hsl(var(--accent))]">A current snapshot</div><div className="grid gap-6 text-lg leading-8 text-[hsl(var(--muted-foreground))] sm:grid-cols-2"><p data-testid="text-learning-intro-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Replace this paragraph with a description of what you are learning.</p><p data-testid="text-learning-intro-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Add the questions, feedback, and next steps that matter to you.</p></div></section>
    <section className="py-20"><div className="mb-8 flex items-end justify-between"><div><StatusPill tone="teal">Where my attention is going</StatusPill><h2 className="mt-4 font-serif text-4xl tracking-[-.05em]" data-testid="heading-learning-focus">The curriculum I’m making for myself.</h2></div></div><div className="grid gap-4 sm:grid-cols-2">{subjects.map(({ icon: SubjectIcon, title, text }, index) => <div className={`paper-card rounded-[1.25rem] p-6 ${index === 1 ? 'sm:translate-y-8' : ''}`} key={title} data-testid={`card-learning-subject-${index}`}><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--accent)/.12)] text-[hsl(var(--accent))]"><SubjectIcon size={20} /></span><h3 className="mt-6 font-serif text-2xl tracking-[-.03em]">{title}</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{text}</p></div>)}</div></section>
    <section className="grid gap-10 md:grid-cols-[1fr_1fr]"><div className="rounded-[1.5rem] bg-[hsl(var(--foreground))] p-7 text-[hsl(var(--background))] sm:p-10"><StatusPill tone="warm">The next question</StatusPill><h2 className="mt-6 font-serif text-4xl leading-none tracking-[-.05em]" data-testid="heading-learning-next">How can technology give someone more confidence?</h2><p className="mt-5 leading-7 text-[hsl(var(--background)/.65)]">I don’t have the answer yet. That’s what makes it a useful question to carry.</p></div><div className="paper-card rounded-[1.5rem] p-7 sm:p-10"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]"><Clock3 size={15} /> A reminder</div><p className="mt-6 font-serif text-3xl leading-tight tracking-[-.04em]" data-testid="text-learning-reminder">Make the thing. Read the docs. Ask for help. Try again.</p><Link href="/future" className="ink-link focus-ring mt-7 inline-flex items-center gap-2 text-sm font-bold no-underline" data-testid="link-learning-future">Follow the direction <ArrowRight size={16} /></Link></div></section>
  </main></PageFrame>;
}

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const login = useAdminLogin({ request: { credentials: 'include' } });
  const submitLogin = (event: FormEvent) => { event.preventDefault(); setLoginError(''); login.mutate({ data: { password } }, { onSuccess: (result) => result.authenticated ? setLoggedIn(true) : setLoginError('That password was not accepted.'), onError: () => setLoginError('Unable to sign in right now. Please try again.') }); };
  if (!loggedIn) return <PageFrame><main className="page-wrap flex min-h-[calc(100dvh-72px)] items-center justify-center py-16"><div className="paper-card w-full max-w-md rounded-[1.5rem] p-7 sm:p-10" data-testid="panel-admin-login"><div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"><LockKeyhole size={23} /></div><StatusPill>Private studio</StatusPill><h1 className="mt-4 font-serif text-5xl tracking-[-.06em]" data-testid="heading-admin-login">Welcome back.</h1><p className="mt-4 leading-7 text-[hsl(var(--muted-foreground))]" data-testid="text-admin-login">The dashboard is where Sana reads and replies to notes from this site.</p><form onSubmit={submitLogin} className="mt-8"><label className="text-sm font-semibold">Admin password<input required type="password" className="input-field mt-2" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="input-admin-password" /></label>{loginError && <p className="mt-4 text-sm text-[hsl(var(--destructive))]" role="alert" data-testid="status-admin-login-error">{loginError}</p>}<button className="button-lift focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-55" disabled={login.isPending} data-testid="button-admin-login">{login.isPending ? 'Checking…' : 'Enter dashboard'} <ArrowRight size={16} /></button></form><Link href="/" className="ink-link focus-ring mt-7 inline-flex text-sm text-[hsl(var(--muted-foreground))] no-underline" data-testid="link-admin-back-home">Back to the public site</Link></div></main></PageFrame>;
  return <AdminDashboard />;
}

function AdminDashboard() {
  const queryClient = useQueryClient();
  const summary = useGetAdminSummary({ query: { queryKey: getGetAdminSummaryQueryKey() }, request: { credentials: 'include' } });
  const messages = useGetAdminMessages({ query: { queryKey: getGetAdminMessagesQueryKey() }, request: { credentials: 'include' } });
  const markReplied = useMarkAdminMessageReplied({ request: { credentials: 'include' } });
  const sortedMessages = useMemo(() => [...(messages.data ?? [])].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()), [messages.data]);
  const reply = (id: string) => markReplied.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetAdminMessagesQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() }); } });
  return <PageFrame><main className="page-wrap page-enter py-12 md:py-20"><div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><StatusPill tone="teal">Private studio / dashboard</StatusPill><h1 className="mt-4 font-serif text-5xl tracking-[-.06em]" data-testid="heading-admin-dashboard">The inbox, <span className="text-[hsl(var(--primary))]">opened.</span></h1></div><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]" data-testid="status-admin-authenticated">Authenticated</span></div>
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[{ label: 'Total messages', value: summary.data?.totalMessages ?? '—', icon: MessageCircle }, { label: 'New messages', value: summary.data?.newMessages ?? '—', icon: Sparkles }, { label: 'Replied', value: summary.data?.repliedMessages ?? '—', icon: Check }, { label: 'Reply rate', value: summary.data ? `${Math.round(summary.data.replyRate)}%` : '—', icon: Target }].map(({ label, value, icon: StatIcon }, index) => <div className="paper-card rounded-[1.2rem] p-5" key={label} data-testid={`card-admin-stat-${index}`}><div className="flex items-center justify-between text-[hsl(var(--muted-foreground))]"><span className="text-xs">{label}</span><StatIcon size={16} /></div><p className="mt-5 font-serif text-4xl tracking-[-.05em]" data-testid={`text-admin-stat-${index}`}>{value}</p></div>)}</section>
    <section className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_.65fr]"><div className="paper-card rounded-[1.5rem] p-5 sm:p-7"><div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="font-serif text-3xl tracking-[-.04em]" data-testid="heading-admin-messages">Recent notes</h2><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">The latest messages from Sana’s inbox.</p></div><IconButton label="refresh messages" onClick={() => { void messages.refetch(); void summary.refetch(); }} className="focus-ring rounded-full border border-[hsl(var(--border))] px-3 py-2 text-xs font-semibold">Refresh</IconButton></div>{messages.isLoading ? <div className="space-y-3" data-testid="status-admin-loading"><div className="h-24 animate-pulse rounded-xl bg-[hsl(var(--muted))]" /><div className="h-24 animate-pulse rounded-xl bg-[hsl(var(--muted))]" /></div> : messages.isError ? <div className="rounded-xl bg-[hsl(var(--destructive)/.1)] p-5 text-sm text-[hsl(var(--destructive))]" data-testid="status-admin-messages-error">Could not load messages. Use refresh to try again.</div> : sortedMessages.length === 0 ? <div className="rounded-xl border border-dashed border-[hsl(var(--border))] p-10 text-center" data-testid="status-admin-empty"><MessageCircle className="mx-auto text-[hsl(var(--muted-foreground))]" /><p className="mt-3 font-serif text-xl">The inbox is quiet.</p><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">New contact notes will appear here.</p></div> : <div className="space-y-3">{sortedMessages.map((message) => <article className="rounded-xl border border-[hsl(var(--border))] p-4" key={message.id} data-testid={`card-admin-message-${message.id}`}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold" data-testid={`text-message-sender-${message.id}`}>{message.firstName} {message.lastName}</h3><StatusPill tone={message.replied ? 'teal' : 'warm'}>{message.replied ? 'Replied' : message.reason}</StatusPill></div><a className="ink-link mt-1 inline-block text-xs text-[hsl(var(--muted-foreground))]" href={`mailto:${message.email}`} data-testid={`link-message-email-${message.id}`}>{message.email}</a></div><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{new Date(message.submittedAt).toLocaleDateString()}</span></div><p className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]" data-testid={`text-message-body-${message.id}`}>{message.message}</p>{!message.replied && <button disabled={markReplied.isPending} onClick={() => reply(message.id)} className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--foreground))] px-3 py-2 text-xs font-semibold text-[hsl(var(--background))] disabled:opacity-50" data-testid={`button-mark-replied-${message.id}`}><Check size={14} /> Mark as replied</button>}</article>)}</div>}</div>
      <aside className="space-y-5"><div className="paper-card rounded-[1.5rem] p-6"><h2 className="font-serif text-2xl tracking-[-.035em]" data-testid="heading-admin-reasons">Messages by reason</h2><div className="mt-5 space-y-4">{(summary.data?.byReason ?? []).map((reason) => <div key={reason.reason} data-testid={`row-admin-reason-${reason.reason}`}><div className="mb-1 flex justify-between text-xs"><span>{reason.reason}</span><span className="font-mono">{reason.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className="h-full rounded-full bg-[hsl(var(--primary))]" style={{ width: `${summary.data?.totalMessages ? Math.max(7, reason.count / summary.data.totalMessages * 100) : 7}%` }} /></div></div>)}</div></div><div className="rounded-[1.5rem] bg-[hsl(var(--secondary)/.45)] p-6"><div className="flex items-center gap-2 text-[hsl(var(--accent))]"><CircleUserRound size={18} /><span className="font-mono text-[10px] uppercase tracking-[.15em]">Studio note</span></div><p className="mt-4 font-serif text-2xl leading-tight tracking-[-.03em]" data-testid="text-admin-studio-note">Reply like a person. It’s the whole point of having an inbox.</p></div></aside></section>
  </main></PageFrame>;
}

function PageFrame({ children }: { children: ReactNode }) {
  return <div className="site-shell"><div className="grain" /><SiteNav />{children}<Footer /></div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/media" component={MediaPage} /><Route path="/future" component={FuturePage} /><Route path="/creative-work" component={CreativeWorkPage} /><Route path="/learning-journey" component={LearningJourneyPage} /><Route path="/admin" component={AdminPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><Router /><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;