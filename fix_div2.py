import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

target = r"\{loadingAction === 'clear' \? 'Limpiando\.\.\.' : 'Limpiar BD'\}\n          </button>\n        </div>\n      </div>\n      \{isLoading \? \("
repl = """{loadingAction === 'clear' ? 'Limpiando...' : 'Limpiar BD'}
          </button>
        </div>
        </div>
      </div>
      {isLoading ? ("""
content = re.sub(target, repl, content)

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)
