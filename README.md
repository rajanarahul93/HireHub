
#  HireHub

A modern full-stack job portal application built with **React**, **Supabase**, and **Clerk**. HireHub lets recruiters post job listings, and job seekers explore, save, and manage opportunities with ease.

---

##  Features

 User Authentication with Clerk  
 Recruiters can:
- Add new job postings
- Upload company logos  
- Delete their job listings  

 Job Seekers can:
- View available jobs
- Save or unsave jobs to a personal saved list  
- View job details

 Real-time Supabase database integration  
 Secure Role-Based Access via Row Level Security (RLS)  
 Upload and serve company logos via Supabase Storage  
 Fully responsive, clean UI with Tailwind CSS  
 State management via React hooks  

---

##  Tech Stack

- **Frontend:** React + Vite + Tailwind CSS  
- **Backend:** Supabase (PostgreSQL, RLS, Storage)  
- **Auth:** Clerk.dev  
- **Icons & UI:** Lucide React, React Spinners  
- **State Handling:** React Hooks  

---

##  Installation & Setup

1️⃣ Clone the repository:
```bash
git clone https://github.com/rajanarahul93/hirehub.git
cd hirehub
````

2️⃣ Install dependencies:

```bash
npm install
```

3️⃣ Configure environment variables:
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4️⃣ Run the development server:

```bash
npm run dev
```

---

##  Supabase Policies Overview

* **jobs table**

  * `INSERT`, `UPDATE`, `SELECT`: Allowed for authenticated recruiters only
* **saved\_jobs table**

  * `INSERT`, `DELETE`, `SELECT`: Allowed for authenticated users only, restricted by `user_id` via RLS
* **companies table**

  * `INSERT`, `SELECT`: Allowed for authenticated users