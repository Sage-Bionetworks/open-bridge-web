import Utility from './utility'
describe('Utility functions', () => {
  it('getOauthEnvironmentFromLocation should should get the environement correctly from the url', () => {
    expect(Utility.getOauthEnvironmentFromLocation(new URL('http://127.0.0.1:3001/something?')).vendor).toBe('arc-dev')
    expect(Utility.getOauthEnvironmentFromLocation(new URL('http://127.0.0.1:3002')).vendor).toBe('inv-arc-dev')
    expect(Utility.getOauthEnvironmentFromLocation(new URL('http://127.0.0.1:3000')).vendor).toBe('mtb-dev')
    expect(
      Utility.getOauthEnvironmentFromLocation(new URL('http://127.0.0.1:3002//studies/pbgjkb/participant-manager'))
        .vendor
    ).toBe('inv-arc-dev')
    expect(
      Utility.getOauthEnvironmentFromLocation(
        new URL('https://staging.studies.mobiletoolbox.org/studies/builder/zgpnsz/session-creator')
      ).vendor
    ).toBe('mtb-staging-studies')
    expect(
      Utility.getOauthEnvironmentFromLocation(
        new URL('https://staging.arcdashboard.sagebionetworks.org/studies/builder/zgpnsz/session-creator')
      ).vendor
    ).toBe('arc-stage')
    expect(
      Utility.getOauthEnvironmentFromLocation(
        new URL('https://staging.inv-arcdashboard.sagebionetworks.org/studies/builder/zgpnsz/session-creator')
      ).vendor
    ).toBe('inv-arc-stage')

    expect(
      Utility.getOauthEnvironmentFromLocation(
        new URL('https://studies.mobiletoolbox.org/assessments/Bf1w8SGCcOTj-ssNIPuDNNS1')
      ).vendor
    ).toBe('mtb-prod')
    expect(
      Utility.getOauthEnvironmentFromLocation(
        new URL('https://arcdashboard.sagebionetworks.org/assessments/Bf1w8SGCcOTj-ssNIPuDNNS1')
      ).vendor
    ).toBe('arc-prod')

    expect(
      Utility.getOauthEnvironmentFromLocation(
        new URL('https://inv-arcdashboard.sagebionetworks.org/assessments/Bf1w8SGCcOTj-ssNIPuDNNS1')
      ).vendor
    ).toBe('inv-arc-prod')
    expect(
      Utility.getOauthEnvironmentFromLocation(new URL('https://staging.arcdashboard.sagebionetworks.org/')).vendor
    ).toBe('arc-stage')
  })
})
