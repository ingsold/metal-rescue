import re

with open('src/pages/MyDonations.tsx', 'r') as f:
    content = f.read()

content = content.replace("import React, { useEffect } from 'react';", "import React, { useState, useEffect } from 'react';")

with open('src/pages/MyDonations.tsx', 'w') as f:
    f.write(content)

