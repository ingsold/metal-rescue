import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

# Remove filteredEvaluations from exportToCSV
target1 = r"    const filteredEvaluations = evaluations\.filter\(ev => \{\n    if \(!startDate && !endDate\) return true;\n    const evDate = new Date\(ev\.fecha_evaluacion\);\n    if \(startDate\) \{\n      const start = new Date\(startDate\);\n      start\.setHours\(0, 0, 0, 0\);\n      if \(evDate < start\) return false;\n    \}\n    if \(endDate\) \{\n      const end = new Date\(endDate\);\n      end\.setHours\(23, 59, 59, 999\);\n      if \(evDate > end\) return false;\n    \}\n    return true;\n  \}\);\n\n  const rows = filteredEvaluations\.map\(ev => \["

repl1 = "    const rows = filteredEvaluations.map(ev => ["
content = re.sub(target1, repl1, content)


# Add it right before exportToCSV
target2 = r"  const exportToCSV = \(\) => \{"
repl2 = """  const filteredEvaluations = evaluations.filter(ev => {
    if (!startDate && !endDate) return true;
    const evDate = new Date(ev.fecha_evaluacion);
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (evDate < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (evDate > end) return false;
    }
    return true;
  });

  const exportToCSV = () => {"""
content = re.sub(target2, repl2, content)

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)

