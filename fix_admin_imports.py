import re

with open('src/pages/AdminPanel.tsx', 'r') as f:
    content = f.read()

imports = """import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Check, X, Edit3, Filter, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, where, orderBy, getDocs, limit, startAfter, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';"""

content = re.sub(r"import React, \{ useState, useEffect \} from 'react';[\s\S]*?import \{ ImageGallery \} from '\.\./components/ImageGallery';", imports, content)

with open('src/pages/AdminPanel.tsx', 'w') as f:
    f.write(content)

