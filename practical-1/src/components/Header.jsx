function Header({ name }) {
  return (
    <header className="header-section fade-in">
      <h1 className="header-title">{name}</h1>
      <h2 className="header-subtitle">Tirth's Portfolio</h2>
    </header>
  );
}

export default Header;