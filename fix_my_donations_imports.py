import re

with open('src/pages/MyDonations.tsx', 'r') as f:
    content = f.read()

imports = """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle2, ShieldCheck, HeartHandshake, Trash2 } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';"""

content = re.sub(r"import React, \{ useState, useEffect \} from 'react';[\s\S]*?import \{ ImageGallery \} from '\.\./components/ImageGallery';", imports, content)

with open('src/pages/MyDonations.tsx', 'w') as f:
    f.write(content)

