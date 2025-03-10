import Image from "next/image";
import styles from "./page.module.css";
import Scene from "./scene";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <Scene />
          <section className={styles.static}>
            <h1 className={styles.title}>Welcome to <Image src="/vercel.svg" alt="Vercel Logo" width={100} height={24} /> Next.js</h1>
          </section>
      </main>
    </div>
  );
}
