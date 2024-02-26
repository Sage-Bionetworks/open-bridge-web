import Utility from '@helpers/utility'

export type SiteLogoVariant = 'large' | 'small' | 'symbol'

export type SiteLogoType = {
    // The size or "variant" of the logo
    variant: SiteLogoVariant
    // The branding id for the logo - this can be used to vend a logo that is for an assessment used by a differently branded website
    brandId?: string
    // a custom key that is used to identify this element
    key?: string
}

const SiteLogo = ({
    variant,
    brandId,
    key,
  }: SiteLogoType) => {
    const branding = Utility.getAppBranding(brandId)
    const subpath = `assets/logo_${branding.logo}_${variant}.svg`
    const source = `${process.env.PUBLIC_URL}/${subpath}`

    return <img src={source} key={key ?? `${brandId}_logo_${variant}`} alt="logo" />
}
  
export default SiteLogo