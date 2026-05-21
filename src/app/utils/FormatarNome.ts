const commonLastNames = ['silva', 'souza', 'santos', 'oliveira', 'pereira', 'lima', 'costa', 'rodrigues', 'alves', 'ribeiro'];

export function formatarNomeUsuario(nome: string): string {
  if (!nome) {
    return '';
  }

  const cleaned = nome.trim().replace(/[._\-]+/g, ' ');
  const parts = cleaned.split(/\s+/).filter(part => part.length > 0);

  if (parts.length === 1) {
    const lowerName = parts[0].toLowerCase();
    for (const lastName of commonLastNames) {
      if (lowerName.endsWith(lastName) && lowerName.length > lastName.length + 1) {
        const firstName = lowerName.slice(0, lowerName.length - lastName.length);
        return `${capitalize(firstName)} ${capitalize(lastName)}`;
      }
    }
    return capitalize(lowerName);
  }

  return parts.map(capitalize).join(' ');
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
