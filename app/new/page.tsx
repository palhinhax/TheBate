import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewTopicForm from "@/features/topics/components/new-topic-form";

export const metadata = {
  title: "Criar Novo Tema - Thebate",
  description: "Crie um novo tema de debate na plataforma Thebate",
};

export default async function NewTopicPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/new");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <a href="/" className="font-bold text-xl">
            Thebate
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Criar Novo Tema</h1>
        <p className="text-muted-foreground mb-8">
          Inicie uma nova discussão sobre um tema que considera relevante.
        </p>
        
        <NewTopicForm />
      </main>
    </div>
  );
}
