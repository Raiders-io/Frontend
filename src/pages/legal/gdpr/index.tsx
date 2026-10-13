type Right = { title: string; description: string }

const rights: Right[] = [ { title: "Right of Access", description: "You can request access to your personal data.", }, { title: "Right to Rectification", description: "You can request the correction of inaccurate or incomplete data.", }, { title: "Right to Erasure", description: "You can request the deletion of your personal data where applicable.", }, { title: "Right to Data Portability", description: "You can request a copy of your data in a portable format where applicable.", }, { title: "Right to Object", description: "You can object to certain types of personal data processing.", }, { title: "Right to Withdraw Consent", description: "You can withdraw your consent at any time when processing is based on consent.", }, ]

export default function GdprPage() { return ( <main className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16"> <header className="mb-12 space-y-4"> <h1 className="text-3xl font-bold tracking-tight md:text-4xl"> Data Protection & GDPR </h1>

<p className="text-muted-foreground leading-7"> You have rights regarding your personal data under applicable data protection laws, including the GDPR. </p> </header>

<section className="mb-12"> <h2 className="mb-6 text-xl font-semibold tracking-tight"> Your Rights </h2>

<ul className="divide-y"> {rights.map((right) => ( <li key={right.title} className="py-5 first:pt-0 last:pb-0" > <h3 className="mb-1 font-medium"> {right.title} </h3>

<p className="text-sm leading-6 text-muted-foreground"> {right.description} </p> </li> ))} </ul> </section>

<section className="space-y-3"> <h2 className="text-xl font-semibold tracking-tight"> Exercising Your Rights </h2>

<p className="text-sm leading-7 text-muted-foreground"> You may contact the data controller to exercise your rights under applicable data protection laws. </p> </section> </main> ) }