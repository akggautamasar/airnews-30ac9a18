interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Airnews</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};