package com.widea.lawlens.config;

import com.widea.lawlens.web.CorrelationIdHolder;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.util.concurrent.TimeUnit;

@Configuration
public class WebClientConfig {

    private final InferenceProperties props;

    public WebClientConfig(InferenceProperties props) {
        this.props = props;
    }

    @Bean
    public WebClient inferenceWebClient() {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(props.getTimeoutMs(), TimeUnit.MILLISECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(props.getTimeoutMs(), TimeUnit.MILLISECONDS)));

        return WebClient.builder()
                .baseUrl(props.getBaseUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .filter(propagateCorrelationId())
                .build();
    }

    private static ExchangeFilterFunction propagateCorrelationId() {
        return (request, next) -> {
            var mutated = org.springframework.web.reactive.function.client.ClientRequest.from(request)
                    .header(CorrelationIdHolder.HEADER, CorrelationIdHolder.get())
                    .build();
            return next.exchange(mutated);
        };
    }
}
