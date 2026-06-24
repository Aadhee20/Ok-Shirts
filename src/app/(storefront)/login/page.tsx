import { LoginForm } from "@/components/forms/login-form";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="container-narrow py-16">
      <LoginForm callbackUrl={callbackUrl ?? "/"} />
    </div>
  );
}
