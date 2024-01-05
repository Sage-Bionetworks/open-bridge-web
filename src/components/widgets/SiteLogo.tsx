
import OpenBridgeLogoLarge from '@assets/logo_open_bridge_large.svg'
import OpenBridgeLogoSmall from '@assets/logo_open_bridge_small.svg'
import OpenBridgeLogoSymbol from '@assets/logo_open_bridge_symbol.svg'
import ArcLogoLarge from '@assets/logo_arc_large.svg'
import ArcLogoSmall from '@assets/logo_arc_small.svg'
import ArcLogoSymbol from '@assets/logo_arc_symbol.svg'
import Utility from '@helpers/utility'

export type SiteLogoVariant = 'large' | 'small' | 'symbol'

export type SiteLogoType = {
    variant: SiteLogoVariant
    key?: string
}

// TODO: syoung 01/05/2023 Replace this with dynamic importing by building the @assets string

function logoLargeWithName(logo: string) {
    return (logo === 'arc') ? ArcLogoLarge : OpenBridgeLogoLarge
}

function logoSmallWithName(logo: string) {
    return (logo === 'arc') ? ArcLogoSmall : OpenBridgeLogoSmall
}

function logoSymbolOnly(logo: string) {
    return (logo === 'arc') ? ArcLogoSymbol : OpenBridgeLogoSymbol
}

function getLogo(variant: SiteLogoVariant, logo: string) {
    switch (variant) {
        case 'large':
            return logoLargeWithName(logo)
        case 'small':
            return logoSmallWithName(logo)
        case 'symbol':
            return logoSymbolOnly(logo)
    }
}

const SiteLogo = ({
    variant,
    key,
  }: SiteLogoType) => {
    const branding = Utility.getAppBranding()
    const src = getLogo(variant, branding.logo)
    console.log(`Branding appId='${branding.appId}' logo='${branding.logo}'`)
    return <img src={src} key={key ?? ('logo_' + variant)} alt="logo" />
}
  
export default SiteLogo