const CompanyLogo = ({ src, style, size = 48 }: LogoProps) => (
  <p
    className={styles.companyLogo}
    style={{ width: size, height: size, ...style }}
  >
    <img src={src} alt="logo" />
  </p>
);
