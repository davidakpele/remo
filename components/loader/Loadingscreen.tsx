import React from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.content}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoShape}>
            <div className={styles.logoLeft}></div>
            <div className={styles.logoRight}></div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className={styles.brandName}>ePay</h1>

        {/* Tagline */}
        <p className={styles.tagline} style={{margin:"0px !important"}}>Business Banking</p>
        <p className={styles.tagline} style={{margin:"0px !important"}}>Initializing</p>
        {/* Loading Bar */}
        <div className={styles.loadingBarContainer} style={{margin:"0px !important"}}>
          <div className={styles.loadingBar} style={{margin:"0px !important"}}></div>
        </div>
      </div>

      {/* Watermark */}
      {/* <div className={styles.watermark}>UNIFIED DYNAMIC SYSTEM</div> */}
    </div>
  );
};

export default LoadingScreen;