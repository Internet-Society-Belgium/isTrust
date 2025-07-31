import * as common from "@istrust/common";
import { CertificateAlert } from "@istrust/ui/alert";
import { Country } from "@istrust/ui/country";
import { DateDifference } from "@istrust/ui/date";
import { HeaderDomain } from "@istrust/ui/header";
import {
  IconBuilding,
  IconCalendar1,
  IconMapPin,
  IconShield,
  IconShieldCheck,
  IconShieldX,
  IconUser,
} from "@istrust/ui/icon";
import { Issue } from "@istrust/ui/issue";
import { SearchBar } from "@istrust/ui/search";
import { Section, SectionItem } from "@istrust/ui/section";
import { Verification } from "@istrust/ui/verification";
import {
  createResource,
  createSignal,
  ErrorBoundary,
  Match,
  onMount,
  resetErrorBoundaries,
  Switch,
  type Component,
} from "solid-js";

const cache: common.DataCache = {
  psl: {
    set: async (key: string, value: string) =>
      localStorage.setItem(`psl:${key}`, value),
    get: async (key: string) => localStorage.getItem(`psl:${key}`),
    clear: async () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === null) continue;

        if (key.startsWith("psl:")) {
          localStorage.removeItem(key);
        }
      }
    },
  },
  rdap: {
    set: async (key: string, value: string) =>
      localStorage.setItem(`rdap:${key}`, value),
    get: async (key: string) => localStorage.getItem(`rdap:${key}`),
    clear: async () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === null) continue;

        if (key.startsWith("rdap:")) {
          localStorage.removeItem(key);
        }
      }
    },
  },
};

const App: Component = () => {
  const [searchQuery, setSearchQuery] = createSignal<{
    text: string;
    forceUpdateCache: boolean;
  }>();

  const [domain, { mutate: mutateDomain }] = createResource(
    searchQuery,
    async (query) => {
      if (query.forceUpdateCache === true) {
        await common.force_update_cache(cache);
      }

      return await common.get_effective_domain(query.text, cache);
    },
  );

  const [whoisData, { mutate: mutateWhoisData }] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_whois_data(domain, cache);
    },
  );

  const [dnssecData, { mutate: mutateDnssecData }] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_dnssec_data(domain);
    },
  );

  const [certificateData, { mutate: mutateCertificateData }] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_certificate_data(domain);
    },
  );

  const [persisted, setPersisted] = createSignal<boolean>();
  onMount(async () => {
    setPersisted(await navigator.storage.persisted());
  });

  const search = async (text: string) => {
    if (!persisted()) {
      await navigator.storage.persist();
      setPersisted(await navigator.storage.persisted());
    }
    setSearchQuery({ text, forceUpdateCache: false });

    resetErrorBoundaries();
  };

  const reload = async () => {
    const oldQuery = searchQuery();
    if (oldQuery === undefined) return;

    mutateDomain();
    mutateWhoisData();
    mutateDnssecData();
    mutateCertificateData();

    setSearchQuery({ text: oldQuery.text, forceUpdateCache: true });
  };

  return (
    <div class="bg-background flex min-h-screen items-center justify-center">
      <div class="flex w-sm flex-col gap-2 p-4">
        <SearchBar
          reload={() => reload()}
          search={(text) => {
            search(text);
          }}
        />

        <div class="bg-container ring-border rounded-lg p-4 ring-1">
          <ErrorBoundary
            fallback={(error) => (
              <Issue
                scope="istrust.org"
                query={searchQuery()?.text || ""}
                error={error}
              />
            )}
          >
            <div class="flex flex-col">
              <HeaderDomain value={domain()} />

              <CertificateAlert types={certificateData()?.types} />

              <div class="flex flex-col gap-2">
                <Section title="Owner">
                  <SectionItem
                    description="Individual name"
                    prefix={<IconUser />}
                    data={common.merge_data_array(
                      certificateData()?.individuals,
                      whoisData()?.individuals,
                    )}
                    suffix={(individual) => (
                      <Verification
                        verification={individual.verification}
                        locale={navigator.language}
                      />
                    )}
                  >
                    {(individual) => <>{individual.value}</>}
                  </SectionItem>

                  <SectionItem
                    description="Organization name"
                    prefix={<IconBuilding />}
                    data={common.merge_data_array(
                      certificateData()?.organizations,
                      whoisData()?.organizations,
                    )}
                    suffix={(organization) => (
                      <Verification
                        verification={organization.verification}
                        locale={navigator.language}
                      />
                    )}
                  >
                    {(organization) => <>{organization.value}</>}
                  </SectionItem>

                  <SectionItem
                    description="Country of residence"
                    prefix={<IconMapPin />}
                    data={common.merge_data_array(
                      certificateData()?.countries,
                      whoisData()?.countries,
                    )}
                    suffix={(country) => (
                      <Verification
                        verification={country.verification}
                        locale={navigator.language}
                      />
                    )}
                  >
                    {(country) => (
                      <Country
                        value={country.value}
                        locale={navigator.language}
                        type="text"
                      />
                    )}
                  </SectionItem>
                </Section>

                <Section title="Domain">
                  <SectionItem
                    description="Period since registration"
                    prefix={<IconCalendar1 />}
                    data={whoisData()?.registrations}
                    suffix={(registration) => (
                      <Verification
                        verification={registration.verification}
                        locale={navigator.language}
                      />
                    )}
                  >
                    {(registration) => (
                      <>
                        Registered{" "}
                        <DateDifference
                          date={registration.value}
                          locale={navigator.language}
                        />
                      </>
                    )}
                  </SectionItem>

                  <SectionItem
                    description="Protection (DNSSEC)"
                    prefix={
                      <Switch>
                        <Match when={dnssecData()?.valid?.value === true}>
                          <IconShieldCheck />
                        </Match>
                        <Match when={dnssecData()?.valid?.value === false}>
                          <IconShieldX />
                        </Match>
                        <Match when={true}>
                          <IconShield />
                        </Match>
                      </Switch>
                    }
                    data={dnssecData()?.valid}
                    suffix={(valid) => (
                      <Verification
                        verification={valid.verification}
                        locale={navigator.language}
                      />
                    )}
                  >
                    {(valid) => (
                      <Switch>
                        <Match when={valid.value === true}>
                          Protected with DNSSEC
                        </Match>
                        <Match when={valid.value === false}>
                          Not protected against manipulation
                        </Match>
                      </Switch>
                    )}
                  </SectionItem>
                </Section>

                {/* <Section title="Debug">
                  <details>
                    <summary>WHOIS raw data</summary>
                    <Show when={whoisData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

                  <details>
                    <summary>certificate raw data</summary>
                    <Show when={certificateData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

                  <details>
                    <summary>DNSSEC raw data</summary>
                    <Show when={dnssecData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>
                </Section> */}
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default App;
