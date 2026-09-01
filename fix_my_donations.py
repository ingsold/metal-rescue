with open('src/pages/MyDonations.tsx', 'r') as f:
    content = f.read()

bad_snippet = """          if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sabbath-500"></div></div>;
  }

  if (!user) {
    return null;
  }

  return ("""

content = content.replace(bad_snippet, "          return (")

correct_insertion = """
  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sabbath-500"></div></div>;
  }

  if (!user) {
    return null;
  }

  return ("""

content = content.replace("  return (\n    <div className=\"space-y-8\">", correct_insertion + "\n    <div className=\"space-y-8\">")

with open('src/pages/MyDonations.tsx', 'w') as f:
    f.write(content)
