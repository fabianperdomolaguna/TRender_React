export function HomePage() {
  return (
    <div className="text-center py-4">
      <h1 className="h3 mb-3">Bienvenid@ a TRender</h1>
      <p className="text-muted mx-auto" style={{ maxWidth: 640 }}>
        La plataforma TRender es una aplicación que permite administrar la venta de cursos Online.
        En el menú lateral se puede acceder a los diferentes módulos de la aplicación.
      </p>
      <img
        className="img-thumbnail border border-secondary mt-3"
        src="/assets/TRender.png"
        alt="Logo TRender"
        width={220}
        height={220}
      />
    </div>
  )
}
