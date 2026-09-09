import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

# Add states
state_target = r"const \[showConfirm, setShowConfirm\] = useState\(false\);"
state_repl = """const [showConfirm, setShowConfirm] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');"""
content = re.sub(state_target, state_repl, content)

# Calculate filtered
csv_target = r"const rows = evaluations\.map\(ev => \["
csv_repl = """const filteredEvaluations = evaluations.filter(ev => {
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

  const rows = filteredEvaluations.map(ev => ["""
content = re.sub(csv_target, csv_repl, content)

# Change export validations
export_btn_target = r"disabled=\{isLoading \|\| evaluations\.length === 0\}"
export_btn_repl = """disabled={isLoading || filteredEvaluations.length === 0}"""
content = re.sub(export_btn_target, export_btn_repl, content)

# Update the list map
list_target = r"evaluations\.map\(\(ev, idx\) => \("
list_repl = """filteredEvaluations.map((ev, idx) => ("""
content = re.sub(list_target, list_repl, content)

# Add UI filters
ui_target = r"<div className=\"flex flex-wrap gap-2\">"
ui_repl = """<div className="flex flex-col sm:flex-row gap-4 w-full justify-end items-end sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center text-sm mr-auto sm:mr-4">
            <div className="flex items-center gap-2">
              <label className="text-zinc-400 font-medium">Desde:</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                className="bg-sabbath-800 text-white border border-sabbath-700 rounded px-2 py-1 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-zinc-400 font-medium">Hasta:</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="bg-sabbath-800 text-white border border-sabbath-700 rounded px-2 py-1 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">"""
content = re.sub(ui_target, ui_repl, content)

empty_msg_target = r"evaluations\.length === 0 \? \("
empty_msg_repl = """filteredEvaluations.length === 0 ? ("""
content = re.sub(empty_msg_target, empty_msg_repl, content)


with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)

