import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewTopicForm from "@/features/topics/components/new-topic-form";

export const metadata = {
  title: "Criar Novo Tema - Thebatee",
  description: "Crie um novo tema de discussão na plataforma Thebatee",
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
          <a href="/" className="text-xl font-bold">
            Thebatee
          </a>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">Criar Novo Tema</h1>
        <p className="mb-8 text-muted-foreground">
          Inicie uma nova discussão sobre um tema que considera relevante.
        </p>

        <NewTopicForm />
      </main>
    </div>
  );
}
