import PageLayout from "examples/LayoutContainers/PageLayout";
import styles from "./login.module.css";
import { Package2, ShoppingCart, BarChart3, Truck } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

export default function LoginPage() {
  const { openSignIn } = useClerk();
  return (
    <PageLayout>
      <div className={styles.container}>
        {/* Background Pattern */}
        <div className={styles.bgPattern}></div>

        <div className={styles.content}>
          {/* Logo */}
          <div className={styles.logoSection}>
            <div className={styles.logoMark}>
              <span className={styles.logoText}>OURMARKET</span>
              <div className={styles.logoBars}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.title}>Sistema de Gestión Empresarial</h1>
              <p className={styles.subtitle}>
                La solución completa para inventario, ventas y distribución
              </p>
            </div>

            {/* Features Grid */}
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <Package2 size={24} />
                </div>
                <span className={styles.featureLabel}>Inventario</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <ShoppingCart size={24} />
                </div>
                <span className={styles.featureLabel}>Punto de Venta</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <BarChart3 size={24} />
                </div>
                <span className={styles.featureLabel}>Análisis</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <Truck size={24} />
                </div>
                <span className={styles.featureLabel}>Distribución</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              className={styles.ctaButton}
              onClick={() =>
                openSignIn({
                  appearance: {
                    elements: {
                      footer: { display: "none" },
                    },
                  },
                })
              }
            >
              <span>Acceder al Sistema</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <p className={styles.footerText}>
              ¿Necesitas ayuda?{" "}
              <a href="#" className={styles.link}>
                Contacta soporte
              </a>
            </p>
          </div>

          {/* Bottom Badge */}
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            <span>Soluciones Informáticas Profesionales</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
